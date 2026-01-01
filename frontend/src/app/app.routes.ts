import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { authChildGuard, authGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './shared/components/public-layout/public-layout.component';
import { isAlreadyAuthGuard } from './core/guards/is-already-auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Error403Component } from './shared/components/403/403.component';
import { Error404Component } from './shared/components/404/404.component';
import { LangGuard } from './core/guards/lang.guard';

export const routes: Routes = [
  {
    path: ':lang',
    canActivate: [LangGuard], // Проверяет корректность кода языка (en, ru, uk)
    children: [
      {
        path: '',
        component: PublicLayoutComponent,
        loadChildren: () => import('./shared/components/public-layout/public-layout.routes').then(m => m.routes)
      },
      {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard, roleGuard],
        canActivateChild: [authChildGuard, roleGuard],
        data: { roles: ['superAdmin', 'admin', 'manager', 'customer'] },
        loadChildren: () => import('./shared/components/admin-layout/admin-layout.routes').then(m => m.routes)
      },
      {
        path: 'login',
        canActivate: [isAlreadyAuthGuard],
        loadChildren: () => import('./routes/login/login.routes').then(m => m.routes)
      },
      {
        path: 'register',
        canActivate: [isAlreadyAuthGuard],
        loadChildren: () => import('./routes/register/register.routes').then(m => m.routes)
      },
      {
        path: '403', component: Error403Component
      },
      {
        path: '404', component: Error404Component
      },
    ]
  },
  // Редирект с корня localhost:4200 на localhost:4200/ru (или другой язык)
  {
    path: '',
    pathMatch: 'full',
    canActivate: [LangGuard],
    children: [], // Этот блок сработает только для редиректа
  },
  {
    path: '**', redirectTo: 'en/404'
  }
];
