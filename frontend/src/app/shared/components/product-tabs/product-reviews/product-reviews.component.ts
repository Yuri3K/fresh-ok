import { Component, input } from '@angular/core';
import { Review } from '../../../../core/services/products.service';

@Component({
  selector: 'app-product-reviews',
  imports: [],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss'
})
export class ProductReviewsComponent {
  reviews = input.required<Review[]>()
}
