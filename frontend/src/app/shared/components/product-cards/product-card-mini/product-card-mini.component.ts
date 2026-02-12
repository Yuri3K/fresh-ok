import { Component, inject, input } from '@angular/core';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { ProductStatusComponent } from '../components/product-status/product-status.component';
import { ProductPriceComponent } from '../components/product-price/product-price.component';
import { ProductRateComponent } from '../components/product-rate/product-rate.component';
import { ProductImageComponent } from '../components/product-image/product-image.component';
import { ProductBadgesComponent } from '../components/product-badges/product-badges.component';
import { Product } from '@shared/models';

@Component({
  selector: 'app-product-card-mini',
  imports: [
    ProductBadgesComponent,
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
