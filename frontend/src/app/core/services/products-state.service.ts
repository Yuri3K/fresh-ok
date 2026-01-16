import { inject, Injectable, signal } from '@angular/core';
import {
  PaginatedResponse,
  Pagination,
  Product,
  ProductsService,
} from './products.service';
import { ActivatedRoute } from '@angular/router';

export type Sort =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest'
  | 'rating';

export interface ProductsState {
  products: PaginatedResponse<Product>;
  category?: string;
  badge?: string;
  priceMin?: number | string;
  priceMax?: number | string;
  rating?: number | string;
  sort?: Sort;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsStateService {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.initFilterFromQueryParams();
  }

  productsState = signal<ProductsState>({} as ProductsState);

  initFilterFromQueryParams() {
    const params = this.route.snapshot.queryParamMap;
    console.log('🚀 ~ params:', params);
    this.productsState.set({
      products: {
        data: [],
        pagination: {} as Pagination,
      },
      category: params.get('category') || 'all',
      badge: params.getAll('badge').join(',') || undefined,
      priceMin: params.get('priceMin') || undefined,
      priceMax: params.get('priceMax') || undefined,
      rating: params.get('rating') || undefined,
      sort: params.get('sort') as Sort,
    });

    this.getProductsByFilter();
  }

  getProductsByFilter() {
    const query = [`category=${this.productsState().category}`];

    if (this.productsState().badge) {
      query.push(`badge=${this.productsState().badge}`);
    }

    if (this.productsState().priceMin) {
      query.push(`priceMin=${this.productsState().priceMin}`);
    }

    if (this.productsState().priceMax) {
      query.push(`priceMax=${this.productsState().priceMax}`);
    }

    if (this.productsState().rating) {
      query.push(`rating=${this.productsState().rating}`);
    }

    if (this.productsState().sort) {
      query.push(`sort=${this.productsState().sort}`);
    }

    this.productsService.getProducts(query).subscribe((res) => {
      console.log('🚀 ~ res:', res);
      this.productsState.update((v) => {
        return {
          ...v,
          products: {
            data: res.data,
            pagination: res.pagination,
          },
        };
      });
      console.log('!!! STATE !!!', this.productsState());
    });
  }
}
