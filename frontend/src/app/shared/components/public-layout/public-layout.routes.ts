import { Routes } from "@angular/router";
import { HomeComponent } from "../../../routes/home/home.component";
import { UserComponent } from "../../../routes/user/user.component";
import { roleGuard } from "../../../core/guards/role.guard";
import { authChildGuard, authGuard } from "../../../core/guards/auth.guard";

export const routes: Routes = [
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
    component: UserComponent,
    canActivate: [authGuard, roleGuard],
    canActivateChild: [authChildGuard, roleGuard],
    data: { roles: ['customer'] },
    loadChildren: () => import('../../../routes/user/user.routes').then(m => m.routes)
  }
]

