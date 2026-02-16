import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CartService } from '@core/services/cart.service';
import { TranslateModule } from '@ngx-translate/core';
import { MiniFabBtnComponent } from '@shared/ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';

@Component({
  selector: 'app-product-delete-btn',
  imports: [
    MiniFabBtnComponent,
    TranslateModule,
  ],
  templateUrl: './product-delete-btn.component.html',
  styleUrl: './product-delete-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDeleteBtnComponent {
  productId = input.required<string>()

  cartService = inject(CartService)

  removeRfomCart() {
    this.cartService.removeItem(this.productId())
  }
}
