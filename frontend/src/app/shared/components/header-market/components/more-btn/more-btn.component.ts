import { Component, input } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { OpenMenuDirective } from '../../../../../core/directives/open-menu.directive';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { ShowSearchBtnComponent } from '../show-search-btn/show-search-btn.component';
import { ProfileBtnComponent } from '../profile-btn/profile-btn.component';
import { FavsBtnComponent } from '../favs-btn/favs-btn.component';

@Component({
  selector: 'app-more-btn',
  imports: [
    MiniFabBtnComponent,
    OpenMenuDirective,
    ShoppingCartComponent,
    ShowSearchBtnComponent,
    FavsBtnComponent,
    ProfileBtnComponent,
  ],
  templateUrl: './more-btn.component.html',
  styleUrl: './more-btn.component.scss',
})
export class MoreBtnComponent {
  componentsList = input<any[]>();
}
