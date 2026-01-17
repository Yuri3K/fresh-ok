import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../../../../core/services/products.service';
import { MEDIA_URL } from '../../../../../core/urls';
import { GetCurrentLangService } from '../../../../../core/services/get-current-lang.service';
import { RouterLink } from '@angular/router';

export type cardType = 'default' | 'mini';

@Component({
  selector: 'app-product-image',
  imports: [
    RouterLink
  ],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.scss',
})
export class ProductImageComponent {
  readonly currentLang = inject(GetCurrentLangService).currentLang;

  product = input.required<Product>();
  cardType = input<cardType>('default');
  width = input('300');
  height = input('215');

  imgUrl = computed(() => {
    return this.cardType() == 'mini'
      ? `${MEDIA_URL}${this.product().publicId}-mini`
      : `${MEDIA_URL}${this.product().publicId}`;
  });
}
