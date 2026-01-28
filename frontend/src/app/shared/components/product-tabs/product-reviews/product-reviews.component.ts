import { Component, computed, inject, input } from '@angular/core';
import { Review } from '../../../../core/services/products.service';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { H4TitleComponent } from '../../../ui-elems/typography/h4-title/h4-title.component';
import { UserAccessService } from '../../../../core/services/user-access.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopupComponent } from '../../popups/login-popup/login-popup.component';
import { LeaveReviewPopupComponent } from '../../popups/leave-review-popup/leave-review-popup.component';
import { BtnFlatComponent } from '../../../ui-elems/buttons/btn-flat/btn-flat.component';

@Component({
  selector: 'app-product-reviews',
  imports: [
    ReviewCardComponent,
    H4TitleComponent,
    TranslateModule,
    BtnFlatComponent,
  ],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss'
})
export class ProductReviewsComponent {
  reviews = input.required<Review[]>()

  private readonly userService = inject(UserAccessService)
  private readonly dialog = inject(MatDialog)

  sortedReviews = computed(() => this.reviews().sort((a, b) =>
    b.createdAt._seconds - a.createdAt._seconds
  ))

  user = toSignal(
    this.userService.dbUser$,
    { initialValue: null }
  )

  addReview() {
    if (!this.user()) {
      const loginDialogRef = this.dialog.open(LoginPopupComponent, {
        panelClass: 'login-dialog',
        // width: '100vw',
        // position: {
        //   bottom: '0',
        //   left: '0',
        // },
        data: {

        }
      })

      loginDialogRef.afterClosed().subscribe((result) => {
        if (result) {

        }
      })
    } else {
      const reviewDialogRef = this.dialog.open(LeaveReviewPopupComponent, {
        panelClass: 'review-dialog',
        // width: '100vw',
        // position: {
        //   bottom: '0',
        //   left: '0',
        // },
        data: {
          maxWidth: '500px',
        }
      })

      reviewDialogRef.afterClosed().subscribe((result) => {
        if (result) {

        }
      })
    }
  }
}

// sdf asd f 