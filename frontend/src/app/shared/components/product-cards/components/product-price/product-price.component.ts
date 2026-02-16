import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CalcDiscountPipe } from '../../../../../core/pipes/calc-discount.pipe';

interface PriceData {
  hasDiscount?: boolean
  price: number
  currency: string
  discountPercent: number
}
@Component({
  selector: 'app-product-price',
  imports: [
    CalcDiscountPipe
  ],
  templateUrl: './product-price.component.html',
  styleUrl: './product-price.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPriceComponent {
  readonly product = input.required<PriceData>()
}
