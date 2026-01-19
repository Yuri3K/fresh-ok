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
      if (this.filterQuery()) this.getProductsByFilter();
    });
  }

  readonly isLoading = signal(false);
  private userPrefferedView = signal<View>('list');
  readonly productsContainerWidth = signal(0);
  readonly isFiltersVisible = signal(true);
  readonly products = signal<Product[]>([]);
  readonly pagination = signal<Pagination>({} as Pagination);
  readonly appliedView = computed(() =>
    this.productsContainerWidth() > 900 ? this.userPrefferedView() : 'grid',
  );

  private readonly queryParams = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params),
      distinctUntilChanged(), //для избежания дублирующих запросов
    ),
  );

  readonly selectedCategory = computed(() => this.queryParams()?.get('category') || 'all');

  private readonly filterQuery = computed(() => {
    const params = this.queryParams();
    const category = params?.get('category');

    return [
      `category=${category === 'all' || !category ? '' : category}`,
      `badge=${this.queryParams()?.getAll('badge').join(',') || ''}`,
      `priceMin=${this.queryParams()?.get('priceMin') || ''}`,
      `priceMax=${this.queryParams()?.get('priceMax') || ''}`,
      `sort=${this.queryParams()?.get('sort') || ''}`,
    ].filter((q) => !!q.split('=')[1]);
  });

  getProductsByFilter() {
    this.isLoading.set(true);
    this.productsService
      .getProducts(this.filterQuery())
      .pipe(debounceTime(100))
      .subscribe({
        next: (res) => {
          console.log('🔸 res:', res);
          this.isLoading.set(false);
          this.products.set(res.data);
          this.pagination.set(res.pagination);
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.isLoading.set(false);
        },
      });
  }

  setProductsContainerWidth(width: number) {
    this.productsContainerWidth.set(width);
  }

  setUserPrefferedView(selectedView: View) {
    this.userPrefferedView.set(selectedView);
  }

  setIsFiltersVisible(isVisible: boolean) {
    this.isFiltersVisible.set(isVisible);
  }
}
