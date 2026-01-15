import { Component, inject, input } from '@angular/core';
import { Product } from '../../../core/services/products.service';
import { GetCurrentLangService } from '../../../core/services/get-current-lang.service';

@Component({
  selector: 'app-product-badge',
  imports: [],
  templateUrl: './product-badge.component.html',
  styleUrl: './product-badge.component.scss'
})
export class ProductBadgeComponent {
  currentLang = inject(GetCurrentLangService).currentLang
  product = input.required<Product>()
  showDiscount = input(true)
}
