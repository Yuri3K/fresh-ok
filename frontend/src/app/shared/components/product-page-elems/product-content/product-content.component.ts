import { Component, effect, inject } from '@angular/core';
import { ProductStateService } from '../../../../core/services/product-state.service';
import { H2TitleComponent } from '../../../ui-elems/typography/h2-title/h2-title.component';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { BadgeComponent } from '../../product-cards/components/product-badges/badge/badge.component';
import { ProductPriceComponent } from '../../product-cards/components/product-price/product-price.component';
import { ProductStarsComponent } from '../product-stars/product-stars.component';
import { ProductCodeComponent } from '../product-code/product-code.component';
import { ProductStatusComponent } from '../../product-cards/components/product-status/product-status.component';

@Component({
  selector: 'app-product-content',
  imports: [
    H2TitleComponent,
    BadgeComponent,
    ProductPriceComponent,
    ProductStarsComponent,
    ProductCodeComponent,
    ProductStatusComponent

  ],
  templateUrl: './product-content.component.html',
  styleUrl: './product-content.component.scss'
})
export class ProductContentComponent {
  readonly currentLang = inject(GetCurrentLangService).currentLang
  readonly product$ = inject(ProductStateService).currentProduct$
}
