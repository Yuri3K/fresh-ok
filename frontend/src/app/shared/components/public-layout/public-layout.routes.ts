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
        component: HomeComponent,
        // Так как в BreadcrumbsComponent автогенерация хлебных крошках 
        // отключена (autoGenerate = input(false)) из-за невозможности 
        // обеспечить мгновенную мультиязычность (перевод для названия продукта 
        // доступен только после получения продукта с сервера. Можно было добавить
        // resolver, но это плохой UI. Пользователь не поймет почему задержка после 
        // клика на корточку товара). Поэтому сейчас data: {...} не выполняет никакой роли
        // Она оставлена только для прммера. 
        data: { breadcrumb: 'homepage' }
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

