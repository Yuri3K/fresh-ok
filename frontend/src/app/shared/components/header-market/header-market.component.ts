import { Component, inject } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { FavsBtnComponent } from './components/favs-btn/favs-btn.component';
import { SearchInMarketComponent } from './components/search-in-market/search-in-market.component';
import { ProfileBtnComponent } from './components/profile-btn/profile-btn.component';
import { MatToolbar } from '@angular/material/toolbar';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CatalogSelectorComponent } from '../../ui-elems/selectors/catalog-selector/catalog-selector.component';
import { ShowElDirective } from '../../../core/directives/show-el.directive';
import { MoreBtnComponent } from './components/more-btn/more-btn.component';
import { ShowSearchService } from './components/show-search-btn/show-search.service';

@Component({
  selector: 'app-header-market',
  imports: [
    LogoComponent,
    CatalogSelectorComponent,
    SearchInMarketComponent,
    FavsBtnComponent,
    ProfileBtnComponent,
    MatToolbar,
    ShoppingCartComponent,
    ShowElDirective,
    MoreBtnComponent
  ],
  templateUrl: './header-market.component.html',
  styleUrl: './header-market.component.scss',
})
export class HeaderMarketComponent {
  showSearchService = inject(ShowSearchService)
 }
