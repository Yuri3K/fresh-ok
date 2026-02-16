import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SvgIconPipe } from '../../../../../core/pipes/svg-icon.pipe';
import { MEDIA_URL } from '../../../../../core/urls';

@Component({
  selector: 'app-payment',
  imports: [
    MatIconModule,
    SvgIconPipe
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent {
  iconColor = input('#fff')
  private payment = signal(['visa', 'mastercard'])

  paymentIcons = computed(() => {
    return this.payment().map(c => `${MEDIA_URL}payment/${c}.svg`)
  })
}
