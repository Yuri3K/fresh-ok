import { Component, input } from '@angular/core';
import { MiniFabBtnComponent } from '../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';

@Component({
  selector: 'app-product-fav-btn',
  imports: [
    MiniFabBtnComponent
  ],
  templateUrl: './product-fav-btn.component.html',
  styleUrl: './product-fav-btn.component.scss'
})
export class ProductFavBtnComponent {
  productId = input.required()

  addToFavs() {
    
  }
}
