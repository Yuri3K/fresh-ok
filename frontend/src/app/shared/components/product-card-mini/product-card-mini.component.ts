import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../../core/services/products.service';
import { GetCurrentLangService } from '../../../core/services/get-current-lang.service';
import { ProductBadgeComponent } from '../product-badge/product-badge.component';
import { MEDIA_URL } from '../../../core/urls';
import { RouterLink } from '@angular/router';
import { ProductStatusComponent } from '../product-status/product-status.component';
import { ProductPriceComponent } from '../product-price/product-price.component';
import { ProductRateComponent } from '../product-rate/product-rate.component';

@Component({
  selector: 'app-product-card-mini',
  imports: [
    ProductBadgeComponent,
    RouterLink,
    ProductStatusComponent,
    ProductPriceComponent,
    ProductRateComponent,
  ],
  templateUrl: './product-card-mini.component.html',
  styleUrl: './product-card-mini.component.scss',
})
export class ProductCardMiniComponent {
  product = input.required<Product>();

  readonly currentLang = inject(GetCurrentLangService).currentLang;

  readonly mediaUrl = computed(
    () => `${MEDIA_URL}${this.product().publicId}-mini`
  );
}
