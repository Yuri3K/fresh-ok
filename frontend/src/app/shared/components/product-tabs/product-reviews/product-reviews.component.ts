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

interface ApiResponse {
  canReview?: boolean;
  review?: Review;
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

  private localReviews = signal<Review[]>([]);
  private deletedReviewsIds = signal<string[]>([]);

  sortedReviews = computed(() => {
    const serverReviews = this.reviews();
    const local = this.localReviews();
    const deleted = this.deletedReviewsIds();

    return [...local, ...serverReviews]
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
      const currentUrl = this.router.url;
      localStorage.setItem('saved-url', currentUrl);
      this.dialog.open(LoginPopupComponent, {
        panelClass: ['login-dialog', 'green'],
        maxWidth: '700px',
        width: '100vw',
      });
    } else {
      this.apiService
        .get<ApiResponse>(`/reviews/check-review/${this.productId()}`)
        .subscribe({
          next: (res) => {
            console.log('🚀 ~ res:', res);
            if (res.canReview) {
              const reviewDialogRef = this.dialog.open(
                LeaveReviewPopupComponent,
                {
                  panelClass: ['review-dialog', 'green'],
                  maxWidth: '700px',
                  width: '100vw',
                  // position: {
                  //   bottom: '0',
                  //   left: '0',
                  // },
                  data: {
                    user: this.user(),
                  },
                },
              );

              reviewDialogRef.afterClosed().subscribe((result) => {
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

                  this.apiService
                    .post('/reviews/addReview', newReview)
                    .subscribe({
                      next: (res) => {
                        this.localReviews.update((v) => [
                          {
                            ...newReview,
                            id: Date.now().toString(),
                            createdAt: Timestamp.now().toMillis(),
                          },
                          ...v,
                        ]);
                      },
                      // error: (err) => {
                      //   if (err.status === 409) {
                      //     this.dialog.open(InfoDialogComponent, {
                      //       panelClass: ['green'],
                      //       maxWidth: '700px',
                      //       width: '100vw',
                      //       enterAnimationDuration: '300ms',
                      //       exitAnimationDuration: '300ms',
                      //       data: {
                      //         translations: this.translateService.instant(
                      //           'product-page.review.review-exists',
                      //         ),
                      //       },
                      //     });
                      //   }
                      // },
                    });
                }
              });
            } else {
              this.dialog.open(InfoDialogComponent, {
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
            }
          },
          error: (err) => {},
        });
    }
  }

  addDeletedId(id: string) {
    this.deletedReviewsIds.update((ids) => [...ids, id]);
  }
}
