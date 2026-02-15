import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '@core/services/cart.service';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
import { CartItem } from '@shared/models';
import { debounceTime, Subject } from 'rxjs';
import { CounterComponent } from '../components/counter/counter.component';
import { ProductBadgesComponent } from '../components/product-badges/product-badges.component';
import { ProductPriceComponent } from '../components/product-price/product-price.component';
import { ProductImageComponent } from '../components/product-image/product-image.component';
import { ProductDeleteBtnComponent } from "../components/product-delete-btn/product-delete-btn.component";

@Component({
  selector: 'app-product-card-cart',
  imports: [
    CounterComponent,
    ProductBadgesComponent,
    ProductPriceComponent,
    ProductImageComponent,
    ProductDeleteBtnComponent
  ],
  templateUrl: './product-card-cart.component.html',
  styleUrl: './product-card-cart.component.scss'
})
export class ProductCardCartComponent implements OnInit {
  readonly cartItem = input.required<CartItem>()

  protected readonly currentLang = inject(GetCurrentLangService).currentLang
  private readonly destroyRef = inject(DestroyRef)
  private readonly cartService = inject(CartService)

  protected readonly quantityChanged$ = new Subject<number>()

  ngOnInit() {
    this.quantityChanged$
      .pipe(
        debounceTime(600),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(quantity => {
        this.cartService.updateQuantity(this.cartItem().productId, quantity)
      })
  }
}
