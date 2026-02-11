import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { H4TitleComponent } from '../../ui-elems/typography/h4-title/h4-title.component';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryAndPaymentDialogComponent } from '../dialogs/delivery-and-payment-dialog/delivery-and-payment-dialog.component';

@Component({
  selector: 'app-delivery-and-payment',
  imports: [
    H4TitleComponent,
    TranslateModule
  ],
  templateUrl: './delivery-and-payment.component.html',
  styleUrl: './delivery-and-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryAndPaymentComponent {
  private readonly dialog = inject(MatDialog)

  openDeliveryAndPaymentDialog() {
    this.dialog.open( DeliveryAndPaymentDialogComponent, {
      panelClass: ['green'],
      maxWidth: '800px',
      width: '100vw',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '150ms',
    })
  }
}
