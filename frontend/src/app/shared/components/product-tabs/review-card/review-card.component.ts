import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MEDIA_URL } from '../../../../core/urls';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';
import { ApiService } from '../../../../core/services/api.service';
import { LeaveReviewPopupComponent } from '../../dialogs/leave-review-popup/leave-review-popup.component';
import { UpdateReviewApiResponse } from '../product-reviews/product-reviews.component';
import { MiniFabBtnComponent } from "../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component";
import { ProductStateService } from '../../../../core/services/product-state.service';
import { Review, DbUser } from '@shared/models';

@Component({
  selector: 'app-review-card',
  imports: [MatIconModule, DatePipe, TranslateModule, MiniFabBtnComponent],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss',
})
export class ReviewCardComponent {
  review = input.required<Review>();
  user = input.required<DbUser | null | undefined>();

  currentReview = signal<Review>({} as Review)

  private readonly dialog = inject(MatDialog);
  private readonly translateService = inject(TranslateService);
  private readonly apiService = inject(ApiService);
  private readonly productStateService = inject(ProductStateService)

  avatar = computed(() => {
    return this.currentReview().userAvatar
      ? `${MEDIA_URL}${this.currentReview().userAvatar}`
      : '';
  });

  date = computed(() => {
    return new Date(this.currentReview().createdAt);
  });

  constructor() {
    effect(() => {
      const review = this.review()

      if(review) {
        this.currentReview.set(review)
      }
    })
  }

  deleteReview(enterAnimationDuration: string, exitAnimationDuration: string) {
    const deleteDialog = this.dialog.open(DeleteDialogComponent, {
      panelClass: ['green'],
      maxWidth: '700px',
      width: '100vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        translations: this.translateService.instant(
          'product-page.review.delete-dialog',
        ),
        info: this.review(),
      },
    });

    deleteDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.delete(`/reviews/delete/${result}`).subscribe(() => {
          this.productStateService.removeReview(result)
        });
      }
    });
  }

  openReviewPopup(enterAnimationDuration: string, exitAnimationDuration: string) {
    const reviewDialogRef = this.dialog.open(LeaveReviewPopupComponent, {
      panelClass: ['review-dialog', 'green'],
      maxWidth: '700px',
      width: '100vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        user: this.user(),
        review: this.currentReview(),
      },
    });

    reviewDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedReview: Omit<Review, 'createdAt'> = {
          id: result.review.id,
          productId: result.review.productId,
          userId: result.review. userId,
          userName: result.review.name,
          text: result.review.textarea,
          rating: result.review.stars,
        };

        if (result.review.userAvatar) {
          updatedReview.userAvatar = result.review.userAvatar;
        }

        this.apiService.patch<UpdateReviewApiResponse>(`/reviews/updateReview/${result.review.id}`, updatedReview).subscribe({
          next: (res) => {
            this.productStateService.updateReview(res.review, res.newRate)
          },
          error: (err) => {},
        });
      }
    });
  }
}
