import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductCardCartComponent } from '../product-cards/product-card-cart/product-card-cart.component';
import { CartService } from '@core/services/cart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { BtnIconComponent } from '@shared/ui-elems/buttons/btn-icon/btn-icon.component';
import { H3TitleComponent } from '@shared/ui-elems/typography/h3-title/h3-title.component';
import { SidebarService } from '@core/services/sidebar.service';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-sidenav-cart',
  imports: [
    ProductCardCartComponent,
    BtnIconComponent,
    H3TitleComponent,
    TranslateModule,
    BtnFlatComponent,
  ],
  templateUrl: './sidenav-cart.component.html',
  styleUrl: './sidenav-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavCartComponent {
  protected readonly cartService = inject(CartService)
  private readonly sidebarService = inject(SidebarService)
  private readonly navigateService = inject(LangRouterService)
  private readonly dialog = inject(MatDialog)
  private readonly translateService = inject(TranslateService)

  protected readonly cartItems = this.cartService.items

  clearCart() {
    const clearCartDialog = this.dialog.open(DeleteDialogComponent, {
      panelClass: ['green'],
      maxWidth: '700px',
      width: '100vw',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
      data: {
        translations: this.translateService.instant(
          'cart.clear-cart-dialog',
        ),
      },
    })

    clearCartDialog.afterClosed().subscribe((result) => {
      if (result) this.cartService.clearCart()
    })
  }

  closeSidebar() {
    this.sidebarService.close('cart')
  }

  navigateToCartPage() {
    if(this.cartService.isEmpty()) return 
    this.navigateService.navigateByUrl('/cart')
  }

}
