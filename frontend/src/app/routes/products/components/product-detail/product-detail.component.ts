import { Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProductTabsComponent } from '../../../../shared/components/product-tabs/product-tabs.component';
import { Product, ProductsService } from '../../../../core/services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [
    BreadcrumbsComponent,
    ProductTabsComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  productsService = inject(ProductsService)

  product = toSignal(
    this.productsService.getProductBySlug('pineapple'),
    { initialValue: {} as Product}
  )
}
