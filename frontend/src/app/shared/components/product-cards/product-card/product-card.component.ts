import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../../../core/services/products.service';
import { MiniFabBtnComponent } from '../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { MEDIA_URL } from '../../../../core/urls';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { ProductBadgeComponent } from '../components/product-badge/product-badge.component';
import { ProductPriceComponent } from '../components/product-price/product-price.component';
import { ProductStatusComponent } from '../components/product-status/product-status.component';
import { ProductRateComponent } from '../components/product-rate/product-rate.component';
import { ProductImageComponent } from '../components/product-image/product-image.component';
import { ProductFavBtnComponent } from '../components/product-fav-btn/product-fav-btn.component';
import { ProductCartBtnComponent } from "../components/product-cart-btn/product-cart-btn.component";
import { CounterComponent } from '../components/counter/counter.component';

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
