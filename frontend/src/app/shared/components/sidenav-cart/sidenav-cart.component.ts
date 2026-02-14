import { Component, inject } from '@angular/core';
import { ProductCardCartComponent } from '../product-cards/product-card-cart/product-card-cart.component';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-sidenav-cart',
  imports: [
    ProductCardCartComponent
  ],
  templateUrl: './sidenav-cart.component.html',
  styleUrl: './sidenav-cart.component.scss'
})
export class SidenavCartComponent {
  protected readonly cartService = inject(CartService)

  protected readonly cartItems = this.cartService.items 
  
  constructor() {}
  
  ngOnInit() {
    console.log("🔸 cartItems:", this.cartItems())
    
  }

}
