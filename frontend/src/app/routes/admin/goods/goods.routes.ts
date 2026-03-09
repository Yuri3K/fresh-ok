import { Routes } from "@angular/router";
import { GoodsComponent } from "./goods.component";
import { AdminCategoryComponent } from "./admin-category/admin-category.component";

export const routes: Routes = [
  {
    path: '',
    data: { roles: ['customer'] },
    component: GoodsComponent,
  },
  {
    path: 'category/:slug',
    data: { roles: ['customer'] },
    component: AdminCategoryComponent
  }
]