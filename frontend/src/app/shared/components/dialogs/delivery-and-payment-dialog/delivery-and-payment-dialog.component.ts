import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { H3TitleComponent } from '../../../ui-elems/typography/h3-title/h3-title.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { H5TitleComponent } from '../../../ui-elems/typography/h5-title/h5-title.component';
import { BtnIconComponent } from '../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { MEDIA_URL } from '../../../../core/urls';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delivery-and-payment-dialog',
  imports: [
    TranslateModule,
    H3TitleComponent,
    H5TitleComponent,
    MatDialogModule,
    BtnIconComponent,
    MatButtonModule
  ],
  templateUrl: './delivery-and-payment-dialog.component.html',
  styleUrl: './delivery-and-payment-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryAndPaymentDialogComponent {
  readonly dialogRef = inject(MatDialogRef)
  readonly heroImg = `${MEDIA_URL}heroes//indi`
}
