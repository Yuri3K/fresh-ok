import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  Pagination,
  Product,
  ProductsService,
} from './products.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';

// export type Sort =
//   | 'price-asc'
//   | 'price-desc'
//   | 'name-asc'
//   | 'name-desc'
//   | 'newest'
//   | 'rating';

// export interface ProductsState {
//   products: PaginatedResponse<Product>;
//   category?: string;
//   badge?: string;
//   priceMin?: number | string;
//   priceMax?: number | string;
//   rating?: number | string;
//   sort?: Sort;
// }

@Injectable({
  providedIn: 'root',
})
export class CatalogStateService {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      if(this.filterQuery().length) this.getProductsByFilter()
    })
  }

  products = signal<Product[]>([]);
  pagination = signal<Pagination>({} as Pagination)
  private readonly queryParams = toSignal(this.route.queryParamMap
    .pipe(
      map(params => params),
      distinctUntilChanged() //для избежания дублирующих запросов
    ))

  private readonly filterQuery = computed(() => {
    return [
      `category=${this.queryParams()?.get('category') || 'all'}`,
      `badge=${this.queryParams()?.getAll('badge').join(',') || ''}`,
      `priceMin=${this.queryParams()?.get('priceMin') || ''}`,
      `priceMax=${this.queryParams()?.get('priceMax') || ''}`,
      `sort=${this.queryParams()?.get('sort') || ''}`,
    ].filter(q => !!q.split('=')[1])
  })

  getProductsByFilter() {
    this.productsService.getProducts(this.filterQuery())
      .subscribe((res) => {
        console.log("🔸 res:", res)
        this.products.set(res.data)
        this.pagination.set(res.pagination)
      });
  }
}
