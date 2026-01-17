import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Pagination, Product, ProductsService } from './products.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounce, debounceTime, distinctUntilChanged, map, pipe } from 'rxjs';

export type View = 'list' | 'grid';

@Injectable({
  providedIn: 'root',
})
export class CatalogStateService {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      if (this.filterQuery().length) this.getProductsByFilter();
    });
  }

  readonly productsContainerWidth = signal(0);
  readonly isLoading = signal(false)
  private userPrefferedView = signal<View>('list');
  readonly appliedView = computed(() => {
    return this.productsContainerWidth() > 900
      ? this.userPrefferedView()
      : 'grid';
  });
  readonly products = signal<Product[]>([]);
  readonly pagination = signal<Pagination>({} as Pagination);
  private readonly queryParams = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params),
      distinctUntilChanged(), //для избежания дублирующих запросов
    ),
  );

  private readonly filterQuery = computed(() => {
    return [
      `category=${this.queryParams()?.get('category') || 'all'}`,
      `badge=${this.queryParams()?.getAll('badge').join(',') || ''}`,
      `priceMin=${this.queryParams()?.get('priceMin') || ''}`,
      `priceMax=${this.queryParams()?.get('priceMax') || ''}`,
      `sort=${this.queryParams()?.get('sort') || ''}`,
    ].filter((q) => !!q.split('=')[1]);
  });

  getProductsByFilter() {
    this.isLoading.set(true)
    this.productsService.getProducts(this.filterQuery())
    .pipe(debounceTime(100))
    .subscribe((res) => {
      console.log('🔸 res:', res);
      this.isLoading.set(false)
      this.products.set(res.data);
      this.pagination.set(res.pagination);
    });
  }

  setProductsContainerWidth(width: number) {
    this.productsContainerWidth.set(width);
  }
}
