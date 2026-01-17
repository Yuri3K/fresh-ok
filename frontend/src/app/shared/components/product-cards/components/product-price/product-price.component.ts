import { Component, input } from '@angular/core';
import { Product } from '../../../../../core/services/products.service';
import { CalcDiscountPipe } from '../../../../../core/pipes/calc-discount.pipe';

@Component({
  selector: 'app-product-price',
  imports: [
    CalcDiscountPipe
  ],
  templateUrl: './product-price.component.html',
  styleUrl: './product-price.component.scss'
})
export class ProductPriceComponent {
  readonly product = input.required<Product>()
}
