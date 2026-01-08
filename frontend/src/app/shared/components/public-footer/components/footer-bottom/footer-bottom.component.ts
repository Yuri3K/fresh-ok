import { Component } from '@angular/core';
import { CopyrightComponent } from '../copyright/copyright.component';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-footer-bottom',
  imports: [
    CopyrightComponent,
    PaymentComponent
  ],
  templateUrl: './footer-bottom.component.html',
  styleUrl: './footer-bottom.component.scss'
})
export class FooterBottomComponent {

}
