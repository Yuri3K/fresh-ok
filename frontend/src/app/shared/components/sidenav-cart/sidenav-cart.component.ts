import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductCardCartComponent } from '../product-cards/product-card-cart/product-card-cart.component';
import { CartService } from '@core/services/cart.service';
import { TranslateModule } from '@ngx-translate/core';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { BtnIconComponent } from '@shared/ui-elems/buttons/btn-icon/btn-icon.component';
import { H3TitleComponent } from '@shared/ui-elems/typography/h3-title/h3-title.component';
import { SidebarService } from '@core/services/sidebar.service';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { CartEmptyComponent } from '@routes/cart-page/cart-empty/cart-empty.component';

@Component({
  selector: 'app-sidenav-cart',
  imports: [
    ProductCardCartComponent,
    BtnIconComponent,
    H3TitleComponent,
    TranslateModule,
    BtnFlatComponent,
    CartEmptyComponent,
  ],
  templateUrl: './sidenav-cart.component.html',
  styleUrl: './sidenav-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavCartComponent {
  protected readonly cartService = inject(CartService)
  private readonly sidebarService = inject(SidebarService)
  private readonly navigateService = inject(LangRouterService)

  protected readonly cartItems = this.cartService.items



  closeSidebar() {
    this.sidebarService.close('cart')
  }

  navigateToCartPage() {
    if(this.cartService.isEmpty()) return 
    this.navigateService.navigateByUrl('/cart')
  }

}
