import { Component, inject, input } from '@angular/core';
import { Product } from '../../../../core/services/products.service';
import { ProductBadgeComponent } from '../components/product-badge/product-badge.component';
import { ProductImageComponent } from '../components/product-image/product-image.component';
import { ProductStatusComponent } from '../components/product-status/product-status.component';
import { ProductRateComponent } from '../components/product-rate/product-rate.component';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { ProductFavBtnComponent } from '../components/product-fav-btn/product-fav-btn.component';
import { ProductCartBtnComponent } from '../components/product-cart-btn/product-cart-btn.component';
import { ProductPriceComponent } from '../components/product-price/product-price.component';
import { CounterComponent } from '../components/counter/counter.component';

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
