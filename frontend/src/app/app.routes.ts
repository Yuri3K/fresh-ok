import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { authChildGuard, authGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './shared/components/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    loadChildren: () => import('./shared/components/public-layout/public-layout.routes').then(m => m.routes)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    loadChildren: () => import('./shared/components/admin-layout/admin-layout.routes').then(m => m.routes)
  },
  {
    path: 'login',
    loadChildren: () => import('./routes/login/login.routes').then(m => m.routes)
  },
  {
    path: 'register',
    loadChildren: () => import('./routes/register/register.routes').then(m => m.routes)
  }
];
