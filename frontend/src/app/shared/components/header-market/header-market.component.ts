import { Component, computed, effect, inject, signal } from '@angular/core';
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
  showSearchService = inject(ShowSearchService)
  showCatalogService = inject(ShowCatalogService)
  elToShowName = signal('')

  constructor() {
    effect(() => {
      const isSearchVisible = this.showSearchService.isSearchVisible()

      if (isSearchVisible) {
        this.showCatalogService.close()
        this.elToShowName.set('search')
      } else if(!this.showCatalogService.isCatalogVisible()) {
        this.elToShowName.set('')
      }


      console.log("EFFECT SEARCH", isSearchVisible)
    })

    effect(() => {
      const isCatalogVisible = this.showCatalogService.isCatalogVisible()

      if (isCatalogVisible) {
        this.showSearchService.close()
        this.elToShowName.set('catalog')
      } else if (!this.showSearchService.isSearchVisible()){
        this.elToShowName.set('')
      }

      console.log("EFFECT CATALOG", isCatalogVisible)
    })


    // effect(() => {
    //   const isSearchVisible = this.showSearchService.isSearchVisible()
    //   const isCatalogVisible = this.showCatalogService.isCatalogVisible()

    //   // Перед тем как что-то открыть - все закрываем, чтобы не было наложений
    //   // this.showSearchService.close()
    //   // this.showCatalogService.close()

    //   if (isSearchVisible) {
    //     this.showCatalogService.close()
    //     this.elToShowName.set('search')
    //   } else if (isCatalogVisible) {
    //     this.showSearchService.close()
    //     this.elToShowName.set('catalog')
    //   } else {
    //     // Если ничего не было выбрано, принудительно все закрываем
    //     // this.showSearchService.close()
    //     // this.showCatalogService.close()
    //     this.elToShowName.set('')
    //   }


    //   console.log("EFFECT", this.elToShowName())

    // })
  }

}
