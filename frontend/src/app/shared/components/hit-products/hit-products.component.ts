import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Product,
  ProductsService,
} from '../../../core/services/products.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-top-products',
  imports: [
    ProductCardComponent
  ],
  templateUrl: './hit-products.component.html',
  styleUrl: './hit-products.component.scss',
})
export class HitProductsComponent implements OnInit {
  productsService = inject(ProductsService);

  hitProducts = signal<Product[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    // this.getHitProducts();
  }

  private getHitProducts() {
    // const queryStr = ['category=fruits'];
    const queryStr = ['badge=hit'];

    this.productsService
      .getProducts(queryStr)
      .subscribe((products) => this.hitProducts.set(products));
  }
}
