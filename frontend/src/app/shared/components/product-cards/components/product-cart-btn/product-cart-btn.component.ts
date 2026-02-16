import { ChangeDetectionStrategy, Component, computed, DestroyRef, HostListener, inject, input, signal } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Product } from '@shared/models';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-product-cart-btn',
  imports: [
    MiniFabBtnComponent,
    TranslateModule,
    AsyncPipe
  ],
  templateUrl: './product-cart-btn.component.html',
  styleUrl: './product-cart-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCartBtnComponent {
  product = input.required<Product>()
  quantity = input<number>(1)
  size = input<'default' | 'big'>('default')

  @HostListener('window:resize')
  OnResize() {
    this.windowWidth.set(window.innerWidth)
  }
  @HostListener('click', ['$event'])
  handleClick() {
    this.addToCart()
  }

  translateService = inject(TranslateService)
  destroyRef = inject(DestroyRef)
  cartService = inject(CartService)

  translations = this.translateService.stream('common.add-to-cart')

  windowWidth = signal(window.innerWidth)
  btnHeight = computed(() => this.size() == 'default' ? '40px' : '44px')
  btnWidth = computed(() => this.size() == 'default' ? '40px' : 'auto')


  btnText = computed(() => {
    if (this.size() == 'big' && this.windowWidth() > 1024) {
      return this.translations
    } else return of(null)
  })


  addToCart() {
    this.cartService.addItem(this.product(), this.quantity())
  }
}
