import { Routes } from "@angular/router";
import { DashboardComponent } from "../../../routes/admin/dashboard/dashboard.component";
import { UsersListComponent } from "../../../routes/admin/users-list/users-list.component";
import { AdminLayoutComponent } from "./admin-layout.component";
import { authChildGuard, authGuard } from "../../../core/guards/auth.guard";
import { roleGuard } from "../../../core/guards/role.guard";
import { GoodsComponent } from "@routes/admin/goods/goods.component";

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    canActivateChild: [authChildGuard, roleGuard],
    data: { roles: ['superAdmin', 'admin', 'manager', 'customer'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        data: { roles: ['superAdmin', 'admin', 'manager', 'customer'] },
        component: DashboardComponent
      },
      {
        path: 'goods',
        data: { roles: ['superAdmin', 'admin', 'manager', 'customer'] },
        loadChildren: () => import('../../../routes/admin/goods/goods.routes').then(m => m.routes)
      },
      {
        path: 'users-list',
        component: UsersListComponent,
        data: { roles: ['superAdmin'] }
      }
    ]
  }
]