import { Component, inject, input } from '@angular/core';
import { Product } from '../../../../../core/services/products.service';
import { GetCurrentLangService } from '../../../../../core/services/get-current-lang.service';
import { BadgeComponent } from './badge/badge.component';

@Component({
  selector: 'app-product-badges',
  imports: [BadgeComponent],
  templateUrl: './product-badges.component.html',
  styleUrl: './product-badges.component.scss'
})
export class ProductBadgesComponent {
  currentLang = inject(GetCurrentLangService).currentLang
  product = input.required<Product>()
}
