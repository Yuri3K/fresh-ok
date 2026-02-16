import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartService } from '@core/services/cart.service';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { H3TitleComponent } from '@shared/ui-elems/typography/h3-title/h3-title.component';
import { MatCardModule } from '@angular/material/card';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';

@Component({
  selector: 'app-cart-summary',
  imports: [
    MatDividerModule,
    TranslateModule,
    DecimalPipe,
    H3TitleComponent,
    MatCardModule,
    BtnFlatComponent,
  ],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  protected readonly cartService = inject(CartService)
}
