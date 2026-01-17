import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../../core/services/products.service';
import { MiniFabBtnComponent } from '../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { MEDIA_URL } from '../../../core/urls';
 import { CounterComponent } from '../counter/counter.component';
import { GetCurrentLangService } from '../../../core/services/get-current-lang.service';
import { ProductBadgeComponent } from '../product-badge/product-badge.component';
import { ProductPriceComponent } from '../product-price/product-price.component';
import { ProductStatusComponent } from '../product-status/product-status.component';
import { ProductRateComponent } from '../product-rate/product-rate.component';
import { ProductImageComponent } from '../product-image/product-image.component';
import { ProductFavBtnComponent } from '../product-fav-btn/product-fav-btn.component';
import { ProductCartBtnComponent } from "../product-cart-btn/product-cart-btn.component";

@Component({
  selector: 'app-product-card',
  imports: [
    CounterComponent,
    ProductBadgeComponent,
    ProductPriceComponent,
    ProductStatusComponent,
    ProductRateComponent,
    ProductImageComponent,
    ProductFavBtnComponent,
    ProductCartBtnComponent
    ,
    ProductCartBtnComponent
],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  withStockAndRate = input(true)
  product = input.required<Product>();

  readonly currentLang = inject(GetCurrentLangService).currentLang;

  imgUrl = computed(() => {
    return MEDIA_URL + this.product().publicId
  })

}
