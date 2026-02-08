import { Component, computed, inject, input } from '@angular/core';
import { Review } from '../../../../core/services/products.service';
import { MEDIA_URL } from '../../../../core/urls';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { BtnFlatComponent } from '../../../ui-elems/buttons/btn-flat/btn-flat.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-review-card',
  imports: [
    MatIconModule,
    DatePipe,
    BtnFlatComponent,
    TranslateModule,
  ],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss'
})
export class ReviewCardComponent {
  review = input.required<Review>()

  private readonly dialog = inject(MatDialog)

  avatar = computed(() => {
    return `${MEDIA_URL}${this.review().userAvatar}`
  })

  date = computed(() => {
    return new Date(this.review().createdAt._seconds * 1000 + this.review().createdAt._nanoseconds / 1e6)
  })

  deleteReview() {
    const deleteDialog = this.dialog.open(DeleteDialogComponent, {
      panelClass: ['green'],
      data: {
        review: this.review()
      }
    })
  }
}
