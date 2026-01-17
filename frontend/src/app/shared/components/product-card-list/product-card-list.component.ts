import { Component, inject, input } from '@angular/core';
import { Product } from '../../../core/services/products.service';
import { ProductBadgeComponent } from '../product-badge/product-badge.component';
import { ProductImageComponent } from '../product-image/product-image.component';
import { ProductStatusComponent } from '../product-status/product-status.component';
import { ProductRateComponent } from '../product-rate/product-rate.component';
import { GetCurrentLangService } from '../../../core/services/get-current-lang.service';
import { ProductFavBtnComponent } from '../product-fav-btn/product-fav-btn.component';
import { ProductCartBtnComponent } from '../product-cart-btn/product-cart-btn.component';
import { CounterComponent } from '../counter/counter.component';
import { ProductPriceComponent } from '../product-price/product-price.component';

@Component({
  selector: 'app-product-card-list',
  imports: [
    ProductBadgeComponent,
    ProductImageComponent,
    ProductStatusComponent,
    ProductRateComponent,
    ProductFavBtnComponent,
    ProductCartBtnComponent,
    CounterComponent,
    ProductPriceComponent,
  ],
  templateUrl: './product-card-list.component.html',
  styleUrl: './product-card-list.component.scss'
})
export class ProductCardListComponent {
  currentLang = inject(GetCurrentLangService).currentLang

  product = input.required<Product>()
}
