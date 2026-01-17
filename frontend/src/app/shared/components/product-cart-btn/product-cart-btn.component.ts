import { Component, input } from '@angular/core';
import { MiniFabBtnComponent } from '../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { Product } from '../../../core/services/products.service';

@Component({
  selector: 'app-product-cart-btn',
  imports: [
    MiniFabBtnComponent
  ],
  templateUrl: './product-cart-btn.component.html',
  styleUrl: './product-cart-btn.component.scss'
})
export class ProductCartBtnComponent {
  product = input.required<Product>()
  addToCart(){}
}
