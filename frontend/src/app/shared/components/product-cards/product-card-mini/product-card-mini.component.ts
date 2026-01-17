import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../../../core/services/products.service';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { ProductBadgeComponent } from '../components/product-badge/product-badge.component';
import { MEDIA_URL } from '../../../../core/urls';
import { ProductStatusComponent } from '../components/product-status/product-status.component';
import { ProductPriceComponent } from '../components/product-price/product-price.component';
import { ProductRateComponent } from '../components/product-rate/product-rate.component';
import { ProductImageComponent } from '../components/product-image/product-image.component';

@Component({
  selector: 'app-product-card-mini',
  imports: [
    ProductBadgeComponent,
    ProductStatusComponent,
    ProductPriceComponent,
    ProductRateComponent,
    ProductImageComponent
  ],
  templateUrl: './product-card-mini.component.html',
  styleUrl: './product-card-mini.component.scss',
})
export class ProductCardMiniComponent {
  product = input.required<Product>();

  readonly currentLang = inject(GetCurrentLangService).currentLang;
}
