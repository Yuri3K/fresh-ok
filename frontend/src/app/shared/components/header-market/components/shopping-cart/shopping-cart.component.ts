import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    MiniFabBtnComponent
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  private readonly router = inject(Router)

  navigateToCart() {
    this.router.navigate(['/cart'], {
      queryParamsHandling: 'merge'
    })
  }
}
