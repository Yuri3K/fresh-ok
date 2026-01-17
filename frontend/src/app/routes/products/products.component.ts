import { Component, HostListener, inject } from '@angular/core';
import { CatalogStateService } from '../../core/services/products-state.service';
import { H2TitleComponent } from '../../shared/ui-elems/typography/h2-title/h2-title.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCardListComponent } from '../../shared/components/product-card-list/product-card-list.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  imports: [
    H2TitleComponent,
    TranslateModule,
    ProductCardListComponent,
    ProductCardComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  stateService = inject(CatalogStateService)
  products = this.stateService.products
  pagination = this.stateService.pagination

  @HostListener("window:resize")
  onResize() {
    const width = window.innerWidth
    if (width < 992) {

    }
  }
}
