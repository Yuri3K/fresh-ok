import { Component, inject } from '@angular/core';
import { CartService } from '@core/services/cart.service';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { LangRouterService } from '@core/services/langs/lang-router.service';

@Component({
  selector: 'app-cart-page',
  imports: [
    CartItemComponent,
    CartSummaryComponent,
    TranslateModule,
    MatButtonModule,
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {
  protected readonly cartService = inject(CartService)
  private readonly navigateService = inject(LangRouterService)

  goToCatalog() {
    this.navigateService.navigate(['/products'])
  }
}
