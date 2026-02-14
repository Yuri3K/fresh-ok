import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { LangRouterService } from '../../../../../core/services/langs/lang-router.service';
import { CartService } from '@core/services/cart.service';
import { SidebarService } from '@core/services/sidebar.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    MiniFabBtnComponent
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  private navigateService = inject(LangRouterService)
  protected readonly sidebarService = inject(SidebarService)

  // protected — это правильный модификатор для всего что используется 
  // только в шаблоне и не должно быть доступно снаружи компонента.
  protected readonly cartService = inject(CartService)

  // navigateToCart() {
  //   this.navigateService.navigate(['/cart'], {
  //     queryParamsHandling: 'merge'
  //   })
  // }
}
