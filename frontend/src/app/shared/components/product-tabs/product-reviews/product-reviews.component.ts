import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Review } from '../../../../core/services/products.service';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { H4TitleComponent } from '../../../ui-elems/typography/h4-title/h4-title.component';
import { UserAccessService } from '../../../../core/services/user-access.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopupComponent } from '../../dialogs/login-popup/login-popup.component';
import { LeaveReviewPopupComponent } from '../../dialogs/leave-review-popup/leave-review-popup.component';
import { BtnFlatComponent } from '../../../ui-elems/buttons/btn-flat/btn-flat.component';
import { RegisterPopupComponent } from '../../dialogs/register-popup/register-popup.component';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { Timestamp } from 'firebase/firestore';
import { InfoDialogComponent } from '../../dialogs/info-dialog/info-dialog.component';

export interface CheckReviewApiResponse {
  canReview?: boolean;
  review?: Review;
}

export interface AddReviewApiResponse {
  message: string;
  review: Review;
}

@Component({
  selector: 'app-product-reviews',
  imports: [
    ReviewCardComponent,
    H4TitleComponent,
    TranslateModule,
    BtnFlatComponent,
  ],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewsComponent {
  reviews = input.required<Review[]>();
  productId = input.required<string>();

  private readonly userService = inject(UserAccessService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private apiService = inject(ApiService);
  private readonly translateService = inject(TranslateService);

  private localReviews = signal<Review | null>(null);
  private deletedReviewsIds = signal<string[]>([]);

  sortedReviews = computed(() => {
    const serverReviews = this.reviews();
    const local = this.localReviews();
    const deleted = this.deletedReviewsIds();

    let finalReviews = [...serverReviews]; 
    if (local) { 
      const idx = finalReviews.findIndex(r => r.id === local.id); 
      if (idx >= 0) { 
        // заменяем существующий 
        finalReviews[idx] = local; 
      } else { 
        // если это новый отзыв — добавляем 
        finalReviews.push(local); 
       } }

    return finalReviews
      .filter((r) => !deleted.includes(r.id))
      .sort((a, b) => b.createdAt - a.createdAt);
  });

  user = toSignal(this.userService.dbUser$, { initialValue: null });

  constructor() {
    effect(() => {
      const user = this.user();

      const loginPopupRef = this.dialog.openDialogs.find(
        (d) => d.componentInstance instanceof LoginPopupComponent,
      );
      const registerPopupRef = this.dialog.openDialogs.find(
        (d) => d.componentInstance instanceof RegisterPopupComponent,
      );

      if (user) {
        if (loginPopupRef || registerPopupRef) {
          loginPopupRef?.close();
          registerPopupRef?.close();
          this.addReview();
        }
      }
    });
  }

  addReview() {
    if (!this.user()) {
      this.openLoginDialog();
    } else {
      this.apiService
        .get<CheckReviewApiResponse>(
          `/reviews/check-review/${this.productId()}`,
        )
        .subscribe({
          next: (res) => {
            if (res.canReview) {
              this.openReviewDialog();
            } else {
              this.openInfoDialog(res.review!);
            }
          },
          error: (err) => {},
        });
    }
  }

  private openLoginDialog() {
    const currentUrl = this.router.url;
    localStorage.setItem('saved-url', currentUrl);

    this.dialog.open(LoginPopupComponent, {
      panelClass: ['login-dialog', 'green'],
      maxWidth: '700px',
      width: '100vw',
    });
  }

  private openReviewDialog(review?: Review) {
    const reviewDialogRef = this.dialog.open(LeaveReviewPopupComponent, {
      panelClass: ['review-dialog', 'green'],
      maxWidth: '700px',
      width: '100vw',
      data: {
        user: this.user(),
        review: review ?? null,
      },
    });

    reviewDialogRef.afterClosed().subscribe((result) => {
      console.log("🚀 ~ result:", result)
      console.log("🚀 ~ result.isEditing:", result.isEditing)
      // return
      if (result) {
        const newReview: Omit<Review, 'id' | 'createdAt'> = {
          productId: this.productId(),
          userId: this.user()!.uid,
          userName: result.review.name,
          text: result.review.textarea,
          rating: result.review.stars,
        };

        if (this.user()?.avatarId) {
          newReview.userAvatar = this.user()?.avatarId;
        }

        if (result.isEditing) {
          console.log("IN EDITING")
          this.apiService
            .patch<AddReviewApiResponse>(`/reviews/updateReview/${result.review.id}`, newReview)
            .subscribe({
              next: (res) => {
                this.localReviews.set(res.review);
              },
            });
        } else {
          console.log("IN ADD REVIEW")
          this.apiService
            .post<AddReviewApiResponse>('/reviews/addReview', newReview)
            .subscribe({
              next: (res) => {
                this.localReviews.set(res.review);
              },
            });
        }
      }
    });
  }

  private openInfoDialog(review: Review) {
    const infoDialog = this.dialog.open(InfoDialogComponent, {
      panelClass: ['green'],
      maxWidth: '700px',
      width: '100vw',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
      data: {
        translations: this.translateService.instant(
          'product-page.review.review-exists',
        ),
      },
    });

    infoDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.openReviewDialog(review);
      }
    });
  }

  addDeletedId(id: string) {
    this.deletedReviewsIds.update((ids) => [...ids, id]);
  }
}
