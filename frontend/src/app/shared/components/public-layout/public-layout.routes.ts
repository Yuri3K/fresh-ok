import { Routes } from "@angular/router";
import { HomeComponent } from "../../../routes/home/home.component";
import { UserComponent } from "../../../routes/user/user.component";
import { roleGuard } from "../../../core/guards/role.guard";
import { FavsComponent } from "../../../routes/favs/favs.component";

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
    canActivate: [roleGuard],
    data: {roles: ['customer']}
  },
  {
    path: 'favs',
    component: FavsComponent,
    canActivate: [roleGuard],
    data: {roles: ['customer']}
  }
]

