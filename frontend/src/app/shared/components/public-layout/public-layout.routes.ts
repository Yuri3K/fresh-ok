import { Routes } from "@angular/router";
import { HomeComponent } from "../../../routes/home/home.component";
import { roleGuard } from "../../../core/guards/role.guard";
import { authChildGuard, authGuard } from "../../../core/guards/auth.guard";
import { PublicLayoutComponent } from "./public-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'products',
        loadChildren: () => import('../../../routes/products/products.routes').then(m => m.routes)
      },
      {
        path: 'user',
        canActivate: [authGuard, roleGuard],
        canActivateChild: [authChildGuard, roleGuard],
        data: { roles: ['customer'] },
        loadChildren: () => import('../../../routes/user/user.routes').then(m => m.routes)
      },
      {
        path: 'cart',
        loadChildren: () => import('../../../routes/cart-page/cart-page.routes').then(m => m.routes)
      }
    ]
  },
]

