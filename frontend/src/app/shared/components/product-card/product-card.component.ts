import { Component, inject, input } from '@angular/core';
import { Product } from '../../../core/services/products.service';
import { LangsService } from '../../../core/services/langs.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  private readonly langsService = inject(LangsService)

  product = input.required<Product>()

  currentLang = toSignal(this.langsService.currentLang$)
}
 