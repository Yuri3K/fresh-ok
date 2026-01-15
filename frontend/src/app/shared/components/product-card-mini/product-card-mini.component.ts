import { Component, inject, input } from '@angular/core';
import { Product } from '../../../core/services/products.service';
import { GetCurrentLangService } from '../../../core/services/get-current-lang.service';

@Component({
  selector: 'app-product-card-mini',
  imports: [],
  templateUrl: './product-card-mini.component.html',
  styleUrl: './product-card-mini.component.scss'
})
export class ProductCardMiniComponent {
  readonly currentLang = inject(GetCurrentLangService).currentLang;

  product = input.required<Product>()
}
