import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { UserAccessService } from './user-access.service';
import { CartItem } from '@shared/models';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';

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
    {initialValue: undefined}
  )


  // Общее количество единиц товара (для бейджа на иконке корзины)
  readonly totalItems = computed(() => this._items().length)

  // Итоговая сумма с учётом скидок
  readonly totalPrice = computed(() => {
    return this._items().reduce((sum, item) => {
      const discounted = item.priceSnapshot * (1 - item.discountPercent / 100) 
      return sum + discounted * item.quantity
    }, 0)
  })

  readonly isEmpty = computed(() => this._items().length === 0)

  constructor() {
    effect(() => {
      const user = this.dbUser()

      if(user == undefined) return

      if(user) {
        // Пользователь залогинился — мержим и загружаем с сервера
        this.mergeWithServer(user.uid)
      } else {
        // Пользователь не залогинен — читаем localStorage
        this.loadFromLS()
      }
    })
  }

  mergeWithServer(userId: string) {

  }

  loadFromLS() {
    const lsCartItems = localStorage.getItem(CART_LS_KEY)
    if(lsCartItems) {
      const parsedItems = JSON.parse(lsCartItems)
      this._items.set(parsedItems)
    } else this._items.set([])
  }


}
