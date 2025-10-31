import { Routes } from "@angular/router";
import { DashboardComponent } from "../../../routes/dashboard/dashboard.component";
import { UsersListComponent } from "../../../routes/users-list/users-list.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'users-list',
    component: UsersListComponent,
    data: {roles: ['superAdmin']}
  }
]