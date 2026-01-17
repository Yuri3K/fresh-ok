import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { H2TitleComponent } from '../../ui-elems/typography/h2-title/h2-title.component';
import { LoaderComponent } from '../loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { BtnFlatComponent } from '../../ui-elems/buttons/btn-flat/btn-flat.component';
import {
  PaginatedResponse,
  Pagination,
  Product,
  ProductsService,
} from '../../../core/services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductFilterBtnComponent } from '../product-filter-btn/product-filter-btn.component';
import { filter, tap } from 'rxjs';
import { ProductCardMiniComponent } from '../product-cards/product-card-mini/product-card-mini.component';
import { ScrollItemsComponent } from '../scroll-items/scroll-items.component';

@Component({
  selector: 'app-promo-products',
  imports: [
    H2TitleComponent,
    LoaderComponent,
    TranslateModule,
    BtnFlatComponent,
    ProductFilterBtnComponent,
    ProductCardMiniComponent,
    ScrollItemsComponent,
  ],
  templateUrl: './promo.component.html',
  styleUrl: './promo.component.scss',
})
export class PromoComponent implements OnInit {
  productsService = inject(ProductsService);

  appliedFilter = signal('discount');
  isLoading = signal(true);
  isShowMoreLoading = signal(false);

  promoProducts = signal<Product[]>([]);
  promoPagination = signal<Pagination>({} as Pagination);

  ngOnInit() {
    this.getPromoProducts();
  }

  private getPromoProducts() {
    const queryStr = ['badge=discount'];

    this.productsService.getProducts(queryStr).subscribe((products) => {
      this.isLoading.set(false);
      this.promoProducts.set(products.data);
      this.promoPagination.set(products.pagination);
    });
  }

  applyFilter(selector: string) {
    if (this.appliedFilter() == selector) return;

    this.appliedFilter.set(selector);
    this.isLoading.set(true);

    const qyeryBadges = ['discount'];

    if (this.appliedFilter() !== 'discount') {
      qyeryBadges.push(this.appliedFilter());
    }

    const queryStr = [
      `badge=${qyeryBadges.join(',')}`, 
      'badgeMode=and'
    ];

    this.productsService.getProducts(queryStr).subscribe((products) => {
      this.isLoading.set(false);
      this.promoProducts.set(products.data);
      this.promoPagination.set(products.pagination);
    });
  }

  showMore() {
    if (!this.promoPagination().hasNextPage) return;

    const currentPage = this.promoPagination().currentPage;
    const qyeryBadges = ['discount'];

    // В случае, если применен фильтр, то поиск должен быть выполнен
    // по фильтру discount + 'hit' | 'new'
    if (this.appliedFilter() !== 'discount') {
      qyeryBadges.push(this.appliedFilter());
    }

    // Добавляем 'badgeMode=and' чтобы були найдены толко те продукты,
    // в которых есть ВСЕ бэйджи, перечисленные в qyeryBadges.
    // ВАЖНО, чтобы первым был всегда указан 'discount', так как
    // бэк сначало найдет все продукты с 'discount', а потом дополнительно
    // отфильтрует по оставшимся бэйджам
    const queryStr = [
      `badge=${qyeryBadges.join(',')}`,
      'badgeMode=and',
      `page=${currentPage + 1}`,
    ];

    this.isShowMoreLoading.set(true);
    this.productsService.getProducts(queryStr).subscribe((products) => {
      this.isShowMoreLoading.set(false);
      this.promoProducts.update((v) => [...v, ...products.data]);
      this.promoPagination.set(products.pagination);
    });
  }
}
