import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MEDIA_URL } from '../../../../core/urls';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { ProductPriceComponent } from '../components/product-price/product-price.component';
import { ProductStatusComponent } from '../components/product-status/product-status.component';
import { ProductRateComponent } from '../components/product-rate/product-rate.component';
import { ProductImageComponent } from '../components/product-image/product-image.component';
import { ProductFavBtnComponent } from '../components/product-fav-btn/product-fav-btn.component';
import { ProductCartBtnComponent } from "../components/product-cart-btn/product-cart-btn.component";
import { CounterComponent } from '../components/counter/counter.component';
import { ProductBadgesComponent } from '../components/product-badges/product-badges.component';
import { Product } from '@shared/models';

@Component({
  selector: 'app-product-card',
  imports: [
    CounterComponent,
    ProductBadgesComponent,
    ProductPriceComponent,
    ProductStatusComponent,
    ProductRateComponent,
    ProductImageComponent,
    ProductFavBtnComponent,
    ProductCartBtnComponent,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  withStockAndRate = input(true)
  product = input.required<Product>();
  readonly currentLang = inject(GetCurrentLangService).currentLang;

  readonly currentQuantity = signal(1)

  imgUrl = computed(() => {
    return MEDIA_URL + this.product().publicId
  })

  onQuantityChange(quantity: number) {
    this.currentQuantity.set(quantity)
  }

}
