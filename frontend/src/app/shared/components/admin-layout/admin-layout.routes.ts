import { Routes } from "@angular/router";
import { DashboardComponent } from "../../../routes/dashboard/dashboard.component";
import { UsersListComponent } from "../../../routes/users-list/users-list.component";
import { AdminLayoutComponent } from "./admin-layout.component";
import { authChildGuard, authGuard } from "../../../core/guards/auth.guard";
import { roleGuard } from "../../../core/guards/role.guard";

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
        path: 'users-list',
        component: UsersListComponent,
        data: { roles: ['superAdmin'] }
      }
    ]
  }
]