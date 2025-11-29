import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { FavsBtnComponent } from './components/favs-btn/favs-btn.component';
import { SearchInMarketComponent } from './components/search-in-market/search-in-market.component';
import { ProfileBtnComponent } from './components/profile-btn/profile-btn.component';
import { MatToolbar } from '@angular/material/toolbar';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-header-market',
  imports: [
    LogoComponent,
    CatalogComponent,
    SearchInMarketComponent,
    FavsBtnComponent,
    ProfileBtnComponent,
    MatToolbar,
    ShoppingCartComponent
  ],
  templateUrl: './header-market.component.html',
  styleUrl: './header-market.component.scss',
})
export class HeaderMarketComponent {}
