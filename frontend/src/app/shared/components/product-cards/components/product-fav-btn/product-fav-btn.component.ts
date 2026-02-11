import { Component, computed, input } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { Product } from '../../../../../core/services/products.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-fav-btn',
  imports: [
    MiniFabBtnComponent,
    TranslateModule,
  ],
  templateUrl: './product-fav-btn.component.html',
  styleUrl: './product-fav-btn.component.scss'
})
export class ProductFavBtnComponent {
  product = input.required<Product>()

  size = input<'default' | 'big'>('default')

  btnWidth = computed(() => this.size() == 'default' ? '40px' : '44px')

  addToFavs() {
    
  }
}
