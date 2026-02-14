import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MEDIA_URL } from '../../../../../core/urls';
import { GetCurrentLangService } from '../../../../../core/services/get-current-lang.service';
import { RouterLink } from '@angular/router';
import { ProductStateService } from '../../../../../core/services/product-state.service';
import { Product } from '@shared/models';

export type cardType = 'default' | 'mini';

@Component({
  selector: 'app-product-image',
  imports: [
    RouterLink
  ],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductImageComponent {
  readonly currentLang = inject(GetCurrentLangService).currentLang;
  private readonly productStateService = inject(ProductStateService)

  product = input.required<Pick<Product, 'publicId' | 'i18n' | 'slug'>>();
  cardType = input<cardType>('default');
  width = input('300');
  height = input('215');

  imgUrl = computed(() => {
    return this.cardType() == 'mini'
      ? `${MEDIA_URL}${this.product().publicId}-mini`
      : `${MEDIA_URL}${this.product().publicId}`;
  });

  // setCurrentProduct() {
    // this.productStateService.setCurrentPruduct(this.product())
  // }
}
