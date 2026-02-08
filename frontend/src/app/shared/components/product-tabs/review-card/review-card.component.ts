import { Component, computed, inject, input } from '@angular/core';
import { Review } from '../../../../core/services/products.service';
import { MEDIA_URL } from '../../../../core/urls';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { BtnFlatComponent } from '../../../ui-elems/buttons/btn-flat/btn-flat.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';
import { ApiService } from '../../../../core/services/api.service';

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
  private  readonly translateService = inject(TranslateService)
  private readonly apiService = inject(ApiService)

  avatar = computed(() => {
    return `${MEDIA_URL}${this.review().userAvatar}`
  })

  date = computed(() => {
    return new Date(this.review().createdAt._seconds * 1000 + this.review().createdAt._nanoseconds / 1e6)
  })

  deleteReview(enterAnimationDuration: string, exitAnimationDuration: string) {
    const deleteDialog = this.dialog.open(DeleteDialogComponent, {
      panelClass: ['green'],
      maxWidth: '700px',
      width: '100vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        translations: this.translateService.instant('product-page.review.delete-dialog'),
        info: this.review()
      }
    })

    deleteDialog.afterClosed().subscribe((result) => {
      console.log("🚀 ~ result:", result)
      if(result) {
        this.apiService.delete(`/reviews/delete/${result}`).subscribe()
      }
    })
  }
}
// sdf 