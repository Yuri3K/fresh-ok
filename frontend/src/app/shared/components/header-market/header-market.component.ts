import { Component, effect, inject, signal } from '@angular/core';
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
import { ShowCatalogService } from './components/show-catalog-btn/show-catalog.service';

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
    MoreBtnComponent,
  ],
  providers: [
    ShowSearchService,
    ShowCatalogService,
  ],
  templateUrl: './header-market.component.html',
  styleUrl: './header-market.component.scss',
})

export class HeaderMarketComponent {
  private readonly showSearchService = inject(ShowSearchService)
  private readonly showCatalogService = inject(ShowCatalogService)

  elToShowName = signal('')

  constructor() {
    // Effect, который контролирует панель поиска на мобильных экранах
    effect(() => {
      const isSearchVisible = this.showSearchService.isSearchVisible()

      if (isSearchVisible) {
        this.showCatalogService.close()
        this.elToShowName.set('search')
        // !!! ПРИМЕНЯТЬ ИМЕННО this.showCatalogService.isCatalogVisible(), 
        // А НЕ const isCatalogVisible = this.showCatalogService.isCatalogVisible(),
        // ПОТОМУ ЧТО EFFECT НАЧНЕТ РЕАГИРОВАТЬ НА isCatalogVisible КАК НА SIGNAL
      } else if (!this.showCatalogService.isCatalogVisible()) {
        this.elToShowName.set('')
      }
    })

    // Effect, который контролирует панель каталога на мобильных экранах
    effect(() => {
      const isCatalogVisible = this.showCatalogService.isCatalogVisible()

      if (isCatalogVisible) {
        this.showSearchService.close()
        this.elToShowName.set('catalog')
        // !!! ПРИМЕНЯТЬ ИМЕННО this.showSearchService.isSearchVisible(), 
        // А НЕ const isSearchVisible = this.showSearchService.isSearchVisible(),
        // ПОТОМУ ЧТО EFFECT НАЧНЕТ РЕАГИРОВАТЬ НА isSearchVisible КАК НА SIGNAL
      } else if (!this.showSearchService.isSearchVisible()) {
        this.elToShowName.set('')
      }
    })

  }

}
