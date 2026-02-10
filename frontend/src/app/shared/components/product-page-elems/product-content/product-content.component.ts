import { Component, inject } from '@angular/core';
import { ProductStateService } from '../../../../core/services/product-state.service';
import { H2TitleComponent } from '../../../ui-elems/typography/h2-title/h2-title.component';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { BadgeComponent } from '../../product-cards/components/product-badges/badge/badge.component';

@Component({
  selector: 'app-product-content',
  imports: [
    H2TitleComponent,
    BadgeComponent
  ],
  templateUrl: './product-content.component.html',
  styleUrl: './product-content.component.scss'
})
export class ProductContentComponent {
  readonly currentLang = inject(GetCurrentLangService).currentLang
  readonly product$ = inject(ProductStateService).currentProduct$
}
