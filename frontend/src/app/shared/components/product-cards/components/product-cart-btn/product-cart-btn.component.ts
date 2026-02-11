import { Component, computed, DestroyRef, HostListener, inject, input, signal } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { Product } from '../../../../../core/services/products.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-product-cart-btn',
  imports: [
    MiniFabBtnComponent,
    TranslateModule,
    AsyncPipe
  ],
  templateUrl: './product-cart-btn.component.html',
  styleUrl: './product-cart-btn.component.scss'
})
export class ProductCartBtnComponent {
  product = input.required<Product>()
  size = input<'default' | 'big'>('default')

  @HostListener('window:resize')
  OnResize() {
    this.windowWidth.set(window.innerWidth)
  }

  translateService = inject(TranslateService)
  destroyRef = inject(DestroyRef)

  translations = this.translateService.stream('common.add-to-cart')

  windowWidth = signal(window.innerWidth)
  btnHeight = computed(() => this.size() == 'default' ? '40px' : '44px')
  btnWidth = computed(() => this.size() == 'default' ? '40px' : 'auto')


  btnText = computed(() => {
    if (this.size() == 'big' && this.windowWidth() > 1024) {
      return this.translations
    } else return of(null)
  })


  addToCart() { }
}
// sdf