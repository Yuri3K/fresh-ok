import { Routes } from "@angular/router";
import { ProductsComponent } from "./products.component";

export const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: ':id',
    loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  }
]