import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Product,
  ProductsService,
} from '../../../core/services/products.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { H2TitleComponent } from '../../ui-elems/typography/h2-title/h2-title.component';
import { LoaderComponent } from '../loader/loader.component';
import { ScrollItemsComponent } from '../scroll-items/scroll-items.component';
import { HitFilterBtnComponent } from './hit-filter-btn/hit-filter-btn.component';
import {
  CatalogItem,
  CatalogService,
} from '../../../core/services/catalog.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { BtnFlatComponent } from '../../ui-elems/buttons/btn-flat/btn-flat.component';

@Component({
  selector: 'app-top-products',
  imports: [
    ProductCardComponent,
    TranslateModule,
    H2TitleComponent,
    LoaderComponent,
    ScrollItemsComponent,
    HitFilterBtnComponent,
    MatIconModule,
    BtnFlatComponent,
  ],
  templateUrl: './hit-products.component.html',
  styleUrl: './hit-products.component.scss',
})
export class HitProductsComponent implements OnInit {
  productsService = inject(ProductsService);
  catalogService = inject(CatalogService);

  hitProducts = signal<Product[]>([]);
  appliedFilter = signal('all');
  isLoading = signal(false);

  categories = toSignal(
    this.catalogService.catalogList$.pipe(
      filter((items): items is CatalogItem[] => !!items.length),
    ),
    { initialValue: [] }
  );

  ngOnInit() {
    this.getHitProducts();
  }

  private getHitProducts() {
    const queryStr = ['badge=hit'];

    this.productsService
      .getProducts(queryStr)
      .subscribe((products) => this.hitProducts.set(products));
  }

  applyFilter(selector: string) {
    if (this.appliedFilter() == selector) return;

    this.appliedFilter.set(selector);
    this.isLoading.set(true);

    const queryStr = ['badge=hit'];

    if (selector !== 'all') {
      queryStr.push(`category=${selector}`);
    }

    this.productsService.getProducts(queryStr).subscribe((products) => {
      this.isLoading.set(false);
      this.hitProducts.set(products);
    });
  }

  showMore() {
    
  }
}
