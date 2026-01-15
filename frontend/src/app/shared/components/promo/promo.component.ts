import { Component, computed, inject, signal } from '@angular/core';
import { H2TitleComponent } from '../../ui-elems/typography/h2-title/h2-title.component';
import { LoaderComponent } from '../loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { BtnFlatComponent } from '../../ui-elems/buttons/btn-flat/btn-flat.component';
import {
  PaginatedResponse,
  Product,
  ProductsService,
} from '../../../core/services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductFilterBtnComponent } from '../product-filter-btn/product-filter-btn.component';
import { filter } from 'rxjs';
import { ProductCardMiniComponent } from '../product-card-mini/product-card-mini.component';

@Component({
  selector: 'app-promo',
  imports: [
    H2TitleComponent,
    LoaderComponent,
    TranslateModule,
    BtnFlatComponent,
    ProductFilterBtnComponent,
    ProductCardMiniComponent,
  ],
  templateUrl: './promo.component.html',
  styleUrl: './promo.component.scss',
})
export class PromoComponent {
  productsService = inject(ProductsService);

  appliedFilter = signal('all');
  isLoading = signal(false);
  isShowMoreLoading = signal(false);

  promoProductsData = toSignal(
    this.productsService
      .getProducts(['badge=discount'])
      .pipe(filter((data) => !!data.data.length)),
    { initialValue: {} as PaginatedResponse<Product> }
  );

  promoProducts = computed(() => {
    console.log("🚀 ~ this.promoProductsData():", this.promoProductsData())
    return this.promoProductsData().data
  });
  promoPagination = computed(() => this.promoProductsData().pagination);


  applyFilter(selector: string) {
    console.log('🚀 ~ selector:', selector);
  }

  showMore() {}
}
