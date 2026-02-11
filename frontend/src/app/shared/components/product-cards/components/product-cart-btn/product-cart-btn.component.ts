import { Component, computed, input } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { Product } from '../../../../../core/services/products.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-cart-btn',
  imports: [
    MiniFabBtnComponent,
    TranslateModule,
  ],
  templateUrl: './product-cart-btn.component.html',
  styleUrl: './product-cart-btn.component.scss'
})
export class ProductCartBtnComponent {
  product = input.required<Product>()
  size = input<'default' | 'big'>('default')

  btnHeight = computed(() => this.size() == 'default' ? '40px' : '44px')
  btnWidth = computed(() => this.size() == 'default' ? '40px' : 'auto')


  addToCart(){}
}
