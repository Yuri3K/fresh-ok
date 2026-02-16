import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '@core/services/cart.service';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
import { CartItem } from '@shared/models';
import { debounceTime, Subject } from 'rxjs';
import { CounterComponent } from '../components/counter/counter.component';
import { ProductBadgesComponent } from '../components/product-badges/product-badges.component';
import { ProductPriceComponent } from '../components/product-price/product-price.component';
import { ProductImageComponent } from '../components/product-image/product-image.component';
import { ProductDeleteBtnComponent } from "../components/product-delete-btn/product-delete-btn.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-card-cart',
  imports: [
    CounterComponent,
    ProductBadgesComponent,
    ProductPriceComponent,
    ProductImageComponent,
    ProductDeleteBtnComponent,
    TranslateModule,
  ],
  templateUrl: './product-card-cart.component.html',
  styleUrl: './product-card-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardCartComponent implements OnInit {
  readonly cartItem = input.required<CartItem>()

  protected readonly currentLang = inject(GetCurrentLangService).currentLang
  private readonly destroyRef = inject(DestroyRef)
  private readonly cartService = inject(CartService)

  protected readonly quantityChanged$ = new Subject<number>()
  protected readonly totalCardPrice = computed(() => {
      // поле discountPercent всегда есть в продукте. Если скидки нет,
      // то discountPercent равен 0 и выражение будет вычислено буз учета скидки
      const discountPrice = this.cartItem().price * (1 - this.cartItem().discountPercent / 100)

      return this.cartItem().quantity * discountPrice
  })

  ngOnInit() {
    this.quantityChanged$
      .pipe(
        debounceTime(600),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(quantity => {
        this.cartService.updateQuantity(this.cartItem().productId, quantity)
      })
  }
}
