import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { UserAccessService } from './user-access.service';
import { Cart, CartItem, Product } from '@shared/models';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { catchError, finalize, merge, Observable, of, tap } from 'rxjs';

const CART_LS_KEY = environment.lsSavedCart

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiService = inject(ApiService)
  private readonly userAccessService = inject(UserAccessService)

  private readonly _items = signal<CartItem[]>([])
  private readonly _isLoading = signal(false)
  private readonly _error = signal<string | null>(null)

  readonly items = this._items.asReadonly()
  readonly isLoading = this._isLoading.asReadonly()
  readonly error = this._error.asReadonly()
  readonly dbUser = toSignal(
    this.userAccessService.dbUser$,
    { initialValue: undefined }
  )

  // Общее количество единиц товара (для бейджа на иконке корзины)
  readonly totalItems = computed(() => this._items().length)

  // Итоговая сумма с учётом скидок
  readonly totalPrice = computed(() => {
    return this._items().reduce((sum, item) => {
      const discounted = item.price * (1 - item.discountPercent / 100)
      return sum + discounted * item.quantity
    }, 0)
  })

  readonly isEmpty = computed(() => this._items().length === 0)

  constructor() {
    effect(() => {
      const user = this.dbUser()

      // Если еше не известно залогинен ли пользователь
      if (user === undefined) {
        return
      }

      if (user) {
        // Пользователь залогинился — мержим и загружаем с сервера
        this.loadItemsFromServer().subscribe()
      } else {
        // Пользователь не залогинен — читаем localStorage
        const items = this.getItemsFromLS()
        this._items.set(items)
      }
    })
  }

  // Получает с сервера сохраненные данные о корзине пользователя
  // Затем объединяет прлученные данные с данными, которые хранятся в 
  // localStorage. 
  private loadItemsFromServer(): Observable<any> {
    this._isLoading.set(true)

    return this.apiService.get<Cart>('/cart')
      .pipe(
        tap((serverCart) => {
          const mergedItems = this.mergeItems(serverCart?.items || [])
          this._items.set(mergedItems)
        }),
        catchError((err) => {
          console.error('[CartService] GetCart error:', err)
          this._error.set('Failed to get cart')
          return of(null)
        }),
        finalize(() => this._isLoading.set(false))
      )
  }

  // Получает данные с localStorage. Применяется тогда, 
  // когда пользователь не залогинен
  private getItemsFromLS() {
    const lsCartItems = localStorage.getItem(CART_LS_KEY)

    return lsCartItems
      ? JSON.parse(lsCartItems)
      : []
  }

  // Сохраняет в localStorage добавленные товары в корзину
  saveItemsInLs() {
    localStorage.setItem(CART_LS_KEY, JSON.stringify(this._items()))
  }

  // Созраняет на сервере ВСЕ товары, которые были добавлены в корзину
  // для конкретного пользователя
  private saveItemsOnServer(items: CartItem[]): Observable<any> {
    return this.apiService.post<Cart>('/cart/save', { items })
      .pipe(
        catchError((err) => {
          console.error('[CartService] saveCart merge error:', err)
          this._error.set('Failed to save cart')
          return of(null)
        }),
        tap(() => localStorage.removeItem(CART_LS_KEY)),
      )
  }

  // Объединяет данные полученные из localStorage т из сервера
  // Применяется тогда, когда пользователь был не залогинен и 
  // добавил товары в корзину, а потом залогинился. 
  // В случае, если на сервере уже были сохранены данные о 
  // корзине с предыдущей сессии, то локальные данные и данные сервера 
  // будут объединены.
  private mergeItems(serverItems: CartItem[]): CartItem[] {
    const localItems = this.getItemsFromLS()

    // Если локальных товаров нет — мерж не нужен, лишний запрос не делаем
  if (localItems.length === 0) return serverItems
  
    const merged = [...serverItems]

    for (const localItem of localItems) {
      const index = merged.findIndex(el => el.productId == localItem.productId)
      if (index !== -1) {
        merged[index] = {
          ...merged[index],
          quantity: merged[index].quantity + localItem.quantity
        }
      } else {
        merged.push(localItem)
      }
    }

    this.saveItemsOnServer(merged).subscribe()
    return merged
  }

  // Добавить товар в корзину
  addItem(product: Product, quantity = 1) {
    const newItem: CartItem = {
      productId: product.id,
      badges: product.badges,
      quantity,
      price: product.price,
      hasDiscount: product.hasDiscount,
      discountPercent: product.discountPercent,
      currency: product.currency,
      publicId: product.publicId,
      slug: product.slug,
      i18n: product.i18n
    }

    // Добавляем товар в корзину, если его нет или
    // симмируем количество единиц, если уже товар добавлен в корзину
    this.applyUpsert(newItem)

    if (this.dbUser()) {
      this.apiService.patch<Cart>('/cart/item', newItem)
        .pipe(
          tap(cart => {
            this._items.set(cart.items)
          }),
          catchError(err => {
            console.error('[CartService] addItem error:', err)
            this._error.set('Failed to add item')
            this.loadItemsFromServer().subscribe()
            return of(null)
          })
        ).subscribe()

    } else {
      this.saveItemsInLs()
    }
  }

  // Удалить товар из корзины
  removeItem(productId: string) {
    this._items.update(items => items.filter(el => el.productId !== productId))

    if (this.dbUser()) {
      this.apiService.delete<Cart>(`/cart/${productId}`)
        .pipe(
          tap(cart => this._items.set(cart.items)),
          catchError((err) => {
            console.error('[CartService] removeItem error:', err)
            this._error.set('Failed to remove item')
            this.loadItemsFromServer().subscribe()
            return of(null)
          })
        ).subscribe()
    } else {
      this.saveItemsInLs()
    }
  }

  // Увеличивает/уменьшает количество КОНКРЕТНОГО ТОВАРА в коризне
  // Мгновенно обновит данные на UI
  // Затем проверит залогинен ли пользоватль. Если да, то отправит данные на сервер
  // Елси нет, то обновит данные в localStorage
  updateQuantity(productId: string, quantity: number) {
    const count = quantity

    if (!count) return

    if (count < 1) {
      this.removeItem(productId)
      return
    }

    const item = this.items().find(item => item.productId === productId)
    if (!item) return

    const updatedItem = { ...item, quantity: count }

    // Обновляем UI
    this._items.update(items =>
      items.map(el => {
        return el.productId === productId
          ? updatedItem
          : el
      })
    )

    if (this.dbUser()) {
      this.apiService.patch<Cart>('/cart/item', updatedItem)
        .pipe(
          tap((cart) => this._items.set(cart.items)),
          catchError(err => {
            console.error('[CartService] updateQuantity error:', err)
            this._error.set('Failed to update quantity')
            this.loadItemsFromServer().subscribe()
            return of(null)
          })
        )
        .subscribe()
    } else {
      this.saveItemsInLs()
    }
  }

  // Очищает корзину пользователя. 
  // Далее проверяет залогинен ли пользователь. 
  // Если да, то очистит карзину на сервере.
  // Если нет, то очистит localStorage
  clearCart() {
    this._items.set([])

    if (this.dbUser()) {
      this.apiService.delete('/cart/clear')
        .pipe(
          catchError((err) => {
            console.error('[CartService] clearCart error:', err)
            this._error.set('Failed to clear cart')
            return of(null)
          })
        ).subscribe()
    } else {
      localStorage.removeItem(CART_LS_KEY)
    }
  }


  private applyUpsert(newItem: CartItem) {
    this._items.update(items => {
      const index = items.findIndex(el => el.productId === newItem.productId)
      if (index !== -1) {
        return items.map((el, idx) => {
          return index == idx
            ? { ...el, quantity: el.quantity + newItem.quantity }
            : el
        })
      } else {
        return [newItem, ...items]
      }
    })
  }
}
