import { Component, computed, input } from '@angular/core';
import { Review } from '../../../../core/services/products.service';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { H4TitleComponent } from '../../../ui-elems/typography/h4-title/h4-title.component';
import { ReviewFormComponent } from '../review-form/review-form.component';

@Component({
  selector: 'app-product-reviews',
  imports: [
    ReviewCardComponent,
    H4TitleComponent,
    TranslateModule,
    ReviewFormComponent
  ],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss'
})
export class ProductReviewsComponent {
  reviews = input.required<Review[]>()

  sortedReviews = computed(() => this.reviews().sort((a, b) =>
    b.createdAt._seconds - a.createdAt._seconds
  ))
}
