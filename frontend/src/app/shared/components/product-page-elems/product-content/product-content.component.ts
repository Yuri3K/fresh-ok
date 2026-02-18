import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProductStateService } from '../../../../core/services/product-state.service';
import { H2TitleComponent } from '../../../ui-elems/typography/h2-title/h2-title.component';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { BadgeComponent } from '../../product-cards/components/product-badges/badge/badge.component';
import { ProductPriceComponent } from '../../product-cards/components/product-price/product-price.component';
import { ProductStarsComponent } from '../product-stars/product-stars.component';
import { ProductCodeComponent } from '../product-code/product-code.component';
import { ProductStatusComponent } from '../../product-cards/components/product-status/product-status.component';
import { CounterComponent } from '../../product-cards/components/counter/counter.component';
import { ProductCartBtnComponent } from '../../product-cards/components/product-cart-btn/product-cart-btn.component';
import { ProductFavBtnComponent } from '../../product-cards/components/product-fav-btn/product-fav-btn.component';
import { DeliveryAndPaymentComponent } from '../../delivery-and-payment/delivery-and-payment.component';

@Component({
  selector: 'app-product-content',
  imports: [
    H2TitleComponent,
    BadgeComponent,
    ProductPriceComponent,
    ProductStarsComponent,
    ProductCodeComponent,
    ProductStatusComponent,
    CounterComponent,
    ProductCartBtnComponent,
    ProductFavBtnComponent,
    DeliveryAndPaymentComponent
  ],
  templateUrl: './product-content.component.html',
  styleUrl: './product-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContentComponent {
  readonly currentLang = inject(GetCurrentLangService).currentLang
  readonly product$ = inject(ProductStateService).currentProduct$

  productRate = computed(() => +this.product$().rate.toFixed(1).toString())

  readonly currentQuantity = signal(1)

  onQuantityChange(quantity: number) {
    this.currentQuantity.set(quantity)
  }
}
