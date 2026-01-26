import { Data, Params, Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    data: {breadcrumb: 'products'},
    children: [
      {
        path: '',
        loadComponent: () => import('./products.component').then(m => m.ProductsComponent),
      },
      {
        path: ':slug',
        loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        data: {
          breadcrumb: (data: Data, params: Params) => {
            return params['slug']
          }
        }
      }
    ]
  },
]