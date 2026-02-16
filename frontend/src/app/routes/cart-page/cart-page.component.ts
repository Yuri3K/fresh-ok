import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartService } from '@core/services/cart.service';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { ProductCardCartComponent } from '@shared/components/product-cards/product-card-cart/product-card-cart.component';
import { H2TitleComponent } from '@shared/ui-elems/typography/h2-title/h2-title.component';
import { CartEmptyComponent } from './cart-empty/cart-empty.component';

@Component({
  selector: 'app-cart-page',
  imports: [
    ProductCardCartComponent,
    CartSummaryComponent,
    TranslateModule,
    MatButtonModule,
    H2TitleComponent,
    CartEmptyComponent,
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent {
  protected readonly cartService = inject(CartService)
  protected readonly cartItems = this.cartService.items
}
