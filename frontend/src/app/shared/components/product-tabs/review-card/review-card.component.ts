import { Component, computed, input } from '@angular/core';
import { Review } from '../../../../core/services/products.service';
import { MEDIA_URL } from '../../../../core/urls';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-review-card',
  imports: [
    MatIconModule,
    DatePipe
  ],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss'
})
export class ReviewCardComponent {
  review = input.required<Review>()

  avatar = computed(() => {
    return `${MEDIA_URL}${this.review().userAvatar}`
  })

  date = computed(() => {
    return new Date(this.review().createdAt._seconds * 1000 + this.review().createdAt._nanoseconds / 1e6)
  })
}

// dfg dfjg lk