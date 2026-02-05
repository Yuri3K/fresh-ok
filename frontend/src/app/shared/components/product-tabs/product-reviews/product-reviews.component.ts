import { Component, computed, effect, inject, input } from '@angular/core';
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

  constructor() {
    effect(() => {
      const user = this.user()
      const loginPopupRef = this.dialog.openDialogs
        .find(d => d.componentInstance instanceof LoginPopupComponent)
      console.log("🔸 isLoginPopupOpened:", loginPopupRef)

      if (user) {
        console.log("USER EXISTS!!!")
        if (loginPopupRef) {
          loginPopupRef.close()
          this.addReview()
        }
      }
    })
  }

  addReview() {
    if (!this.user()) {
      localStorage.setItem('saved-url', '/en/products/pineapple')
      const loginDialogRef = this.dialog.open(LoginPopupComponent, {
        panelClass: 'login-dialog',
        maxWidth: '700px',
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
        // maxWidth: '500px',
        // width: '100vw',
        // position: {
        //   bottom: '0',
        //   left: '0',
        // },
        data: {
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