import { Data, Params, Routes } from "@angular/router";
import { ProductsComponent } from "./products.component";

export const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    data: {breadcrumb: 'products'}
  },
  {
    path: ':slug',
    loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    data: {
      breadcrumd: (data: Data, params: Params) => {
        console.log("🔸 params:", params)
        console.log("🔸 data:", data)
        return 'Hello World'
      }
    }
  }
]