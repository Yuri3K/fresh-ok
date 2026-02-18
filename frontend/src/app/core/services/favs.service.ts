import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { ApiService } from "./api.service";
import { UserAccessService } from "./user-access.service";
import { OpenSignDialogService } from "./open-sign-dialog.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { FavsDocument } from "@shared/models";
import { catchError, finalize, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class FavsService {
  private readonly apiService = inject(ApiService)
  private readonly userAccessService = inject(UserAccessService)
  private readonly signDialogService = inject(OpenSignDialogService)

  private readonly _productIds = signal<string[]>([])
  private readonly _isLoading = signal<boolean>(false)
  private readonly _error = signal<string>('')

  productIds = this._productIds.asReadonly()
  isLoading = this._isLoading.asReadonly()
  error = this._error.asReadonly()

  readonly totalFavs = computed(() => this._productIds().length)

  readonly dbUser = toSignal(
    this.userAccessService.dbUser$,
    { initialValue: undefined }
  )

  // Map для отслеживания товаров в процессе изменения
  private readonly pendingIds = new Set<string>()

  constructor() {
    effect(() => {
      const user = this.dbUser()

      if (user === undefined) return

      if (user) {
        this.loadFromServer()
      } else {
        // Пользователь разлогинился — очищаем список
        this._productIds.set([])
      }

    })
  }

  // Проверяет находится ли товар в избранном
  isFav(productId: string) {
    return this._productIds().includes(productId)
  }

  // Проверяет находится ли товар в процессе изменения
  isPending(productId: string): boolean {
    return this.pendingIds.has(productId)
  }

  // Toggle — добавить (если нет), удалить (если есть)
  toggleFav(productId: string) {
    const user = this.dbUser()

    if (!user) {
      this.signDialogService.openLoginDialog()
      return
    }

    // Если запрос уже в процессе — игнорируем повторный клик
    if (this.isPending(productId)) {
      return
    }

    this.isFav(productId)
      ? this.removeFav(productId)
      : this.addFav(productId)
  }

  private loadFromServer() {
    this._isLoading.set(true)

    this.apiService.get<FavsDocument>('/favs/')
      .pipe(
        tap(favsData => this._productIds.set(favsData.productIds ?? [])),
        catchError(err => {
          console.error('[FavsService] loadFromServer error:', err)
          this._error.set("Failed to load Favs")
          return of(null)
        }),
        finalize(() => this._isLoading.set(false))
      ).subscribe()
  }

  private addFav(productId: string) {
    // Блокируем повторные клики
    this.pendingIds.add(productId)

    // Оптимистично обновляем UI
    this._productIds.update(ids => [...ids, productId])

    this.apiService.post<FavsDocument>('/favs', { productId })
      .pipe(
        tap(favsData => this._productIds.set(favsData.productIds ?? [])),
        catchError(err => {
          console.error('[FavsService] addFav error:', err)
          this._error.set('Failed to add fav')
          // Откатываем оптимистичное обновление
          this._productIds.update(ids => ids.filter(id => id !== productId))
          return of(null)
        }),
        finalize(() => this.pendingIds.delete(productId))
      ).subscribe()
  }

  private removeFav(productId: string) {
    // Блокируем повторные клики
    this.pendingIds.add(productId)

    // Оптимистично обновляем UI
    this._productIds.update(ids => ids.filter(id => id !== productId))

    this.apiService.delete<FavsDocument>(`/favs/${productId}`)
      .pipe(
        tap(favsData => this._productIds.set(favsData.productIds ?? [])),
        catchError(err => {
          console.log('[FavsService] removeFav error', err)
          this._error.set("'Failed to remove fav'")
          this._productIds.update(ids => [...ids, productId])
          return of(null)
        }),
        finalize(() => this.pendingIds.delete(productId))
      ).subscribe()
  }
}