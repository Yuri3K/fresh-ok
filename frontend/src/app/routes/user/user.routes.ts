import { Routes } from "@angular/router";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { FavsComponent } from "./components/favs/favs.component";
import { UserComponent } from "./user.component";

export const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '', 
        redirectTo: 'profile',
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
  },
]