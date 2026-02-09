import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Review } from '../../../../core/services/products.service';
import { MEDIA_URL } from '../../../../core/urls';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { BtnFlatComponent } from '../../../ui-elems/buttons/btn-flat/btn-flat.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';
import { ApiService } from '../../../../core/services/api.service';
import { dbUser } from '../../../../core/services/user-access.service';
import { Timestamp } from 'firebase/firestore';

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
  user = input.required<dbUser | null|  undefined>()

  onDeleteReview = output<string>()

  private readonly dialog = inject(MatDialog)
  private  readonly translateService = inject(TranslateService)
  private readonly apiService = inject(ApiService)


  avatar = computed(() => {
    return this.review().userAvatar
      ? `${MEDIA_URL}${this.review().userAvatar}`
      : ''
  })

  date = computed(() => {
    return new Date(this.review().createdAt)
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
      if(result) {
        this.apiService.delete(`/reviews/delete/${result}`).subscribe()
        this.onDeleteReview.emit(result)
      }
    })
  }

}
