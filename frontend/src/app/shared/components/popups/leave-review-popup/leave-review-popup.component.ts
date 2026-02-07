import { Component, inject } from '@angular/core';
import { ReviewFormComponent } from '../../product-tabs/review-form/review-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { H3TitleComponent } from '../../../ui-elems/typography/h3-title/h3-title.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BtnIconComponent } from '../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { dbUser } from '../../../../core/services/user-access.service';

@Component({
  selector: 'app-leave-review-popup',
  imports: [
    ReviewFormComponent,
    H3TitleComponent,
    TranslateModule,
    BtnIconComponent
],
  templateUrl: './leave-review-popup.component.html',
  styleUrl: './leave-review-popup.component.scss'
})
export class LeaveReviewPopupComponent {
  readonly dialogRef = inject(MatDialogRef)
  readonly data = inject(MAT_DIALOG_DATA);
  
  ngOnInit() {
    console.log("🔸 MAT_DIALOG_DATA:", this.data.user)
    
  }
}
