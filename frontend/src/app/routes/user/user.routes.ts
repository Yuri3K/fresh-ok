import { Routes } from "@angular/router";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { FavsComponent } from "./components/favs/favs.component";

export const routes: Routes = [
  {
    path: '', 
    redirectTo: '/user/profile',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    data: {roles: ['customer']},
    component: UserProfileComponent
  },
  {
    path: 'favs',
    component: FavsComponent,
    data: {roles: ['customer']}
  }
]