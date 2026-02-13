import { Component, inject } from '@angular/core';
import { CartService } from '@core/services/cart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cart-summary',
  imports: [
    MatButtonModule,
    MatDividerModule,
    TranslateModule,
    DecimalPipe,
  ],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent {
  protected readonly cartService = inject(CartService)
}
