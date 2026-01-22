import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { LangRouterService } from '../../../../../core/services/langs/lang-router.service';

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

  navigateToCart() {
    this.navigateService.navigate(['/cart'], {
      queryParamsHandling: 'merge'
    })
  }
}
