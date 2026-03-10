import { Component, inject, input } from '@angular/core';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
import { Product } from '@shared/models';

@Component({
  selector: 'app-admin-product-card',
  imports: [],
  templateUrl: './admin-product-card.component.html',
  styleUrl: './admin-product-card.component.scss'
})
export class AdminProductCardComponent {
  readonly product = input.required<Product>()

  protected readonly currentLang = inject(GetCurrentLangService).currentLang
}
