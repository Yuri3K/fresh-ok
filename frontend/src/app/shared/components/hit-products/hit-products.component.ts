import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Pagination,
  Product,
  ProductsService,
} from '../../../core/services/products.service';
import { ProductCardComponent } from '../product-cards/product-card/product-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { H2TitleComponent } from '../../ui-elems/typography/h2-title/h2-title.component';
import { LoaderComponent } from '../loader/loader.component';
import { ScrollItemsComponent } from '../scroll-items/scroll-items.component';
import {
  CatalogItem,
  CatalogService,
} from '../../../core/services/catalog.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { BtnFlatComponent } from '../../ui-elems/buttons/btn-flat/btn-flat.component';
import { ProductFilterBtnComponent } from '../product-filter-btn/product-filter-btn.component';
import { GetCurrentLangService } from '../../../core/services/get-current-lang.service';

@Component({
  selector: 'app-hit-products',
  imports: [
    ProductCardComponent,
    TranslateModule,
    H2TitleComponent,
    LoaderComponent,
    ScrollItemsComponent,
    ProductFilterBtnComponent,
    MatIconModule,
    BtnFlatComponent,
  ],
  templateUrl: './hit-products.component.html',
  styleUrl: './hit-products.component.scss',
})
export class HitProductsComponent implements OnInit {
  productsService = inject(ProductsService);
  catalogService = inject(CatalogService);
  readonly currentLang = inject(GetCurrentLangService).currentLang;

  hitProducts = signal<Product[]>([]);
  hitPagination = signal<Pagination>({} as Pagination);
  appliedFilter = signal('all');
  isLoading = signal(true);
  isShowMoreLoading = signal(false);

  categories = toSignal(
    this.catalogService.catalogList$.pipe(filter((items) => !!items.length)),
    { initialValue: [] }
  );

  ngOnInit() {
    this.getHitProducts();
  }

  private getHitProducts() {
    const queryStr = ['badge=hit'];

    this.productsService.getProducts(queryStr).subscribe((products) => {
      this.isLoading.set(false);
      this.hitProducts.set(products.data);
      this.hitPagination.set(products.pagination);
    });
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
      this.hitProducts.set(products.data);
      this.hitPagination.set(products.pagination);
    });
  }

  showMore() {
    if (!this.hitPagination().hasNextPage) return;

    const currentPage = this.hitPagination().currentPage;
    const queryStr = ['badge=hit', `page=${currentPage + 1}`];

    if (this.appliedFilter() !== 'all') {
      queryStr.push(`category=${this.appliedFilter()}`);
    }
    console.log('🚀 ~ queryStr:', queryStr);

    this.isShowMoreLoading.set(true);

    this.productsService.getProducts(queryStr).subscribe((products) => {
      this.isShowMoreLoading.set(false);
      this.hitProducts.update((v) => [...v, ...products.data]);
      this.hitPagination.set(products.pagination);
    });
  }
}
