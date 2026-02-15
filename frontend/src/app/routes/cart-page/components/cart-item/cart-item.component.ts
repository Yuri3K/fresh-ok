import { Component, inject, input, signal } from '@angular/core';
import { CartItem } from '@shared/models';
import { CartService } from '@core/services/cart.service';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
import { CalcDiscountPipe } from '@core/pipes/calc-discount.pipe';
import { MEDIA_URL } from '@core/urls';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart-item',
  imports: [
    CalcDiscountPipe,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>()

  protected readonly cartService = inject(CartService)
  protected readonly currentLang = inject(GetCurrentLangService).currentLang
  private readonly navigateService = inject(LangRouterService)

  protected readonly MEDIA_URL = MEDIA_URL

  // Локальный сигнал для мгновенного отображения quantity
  protected readonly quantity = signal(1)

  // Subject для debounce — отправляем на сервер только после паузы
  quantityChange$ = new Subject<number>()

  constructor() {
    // Когда item придёт — инициализируем локальный quantity
    // Используем effect чтобы реагировать на изменение input
    
    // Debounce — ждём 600мс после последнего изменения и только тогда
    // отправляем запрос на сервер
    this.quantityChange$.pipe(
      debounceTime(600),
      takeUntilDestroyed()
    ).subscribe(qty => {
      this.cartService.updateQuantity(this.item().productId, qty)
    })
  }

  ngOnInit() {
    this.quantity.set(this.item().quantity)
  }

  increase() {
    const current = this.quantity()
    if (current < 999) {
      const next = current + 1
      this.quantity.set(next)
      this.quantityChange$.next(next)
    }
  }

  decrease() {
    const current = this.quantity()
    if (current > 1) {
      const prev = current - 1
      this.quantity.set(prev)
      this.quantityChange$.next(prev)
    }
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement
    let val = parseInt(target.value, 10)
    if (val > 999) val = 999
    if (val < 1) val = 1
    this.quantity.set(val)
    this.quantityChange$.next(val)
  }

  remove() {
    this.cartService.removeItem(this.item().productId)
  }

  navigateToProduct() {
    this.navigateService.navigate(['/products', this.item().slug])
  }

  get hasDiscount(): boolean {
    return this.item().discountPercent > 0
  }
}
