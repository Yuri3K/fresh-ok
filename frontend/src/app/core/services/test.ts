import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Pagination, Product, ProductsService } from './products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, catchError, of } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

export type View = 'list' | 'grid';

@Injectable({
  providedIn: 'root',
})
export class CatalogStateService {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private filtersSidenavSubject = new BehaviorSubject<MatSidenav | null>(null);
  filtersSidenav$ = this.filtersSidenavSubject.asObservable();

  readonly isLoading = signal(false);
  private userPrefferedView = signal<View>('list');
  readonly productsContainerWidth = signal(0);
  readonly products = signal<Product[]>([]);
  readonly pagination = signal<Pagination>({} as Pagination);
  
  readonly appliedView = computed(() => 
    this.productsContainerWidth() > 900 ? this.userPrefferedView() : 'grid'
  );

  private readonly queryParams = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params),
      distinctUntilChanged(),
    ),
  );

  readonly selectedCategory = computed(() => 
    this.queryParams()?.get('category') || 'all'
  );

  // Computed для текущей страницы
  readonly currentPage = computed(() => {
    const page = this.queryParams()?.get('page');
    return page ? parseInt(page, 10) : 1;
  });

  // Computed для лимита на странице
  readonly limit = computed(() => {
    const limit = this.queryParams()?.get('limit');
    return limit ? parseInt(limit, 10) : 12;
  });

  private readonly filterQuery = computed(() => {
    const params = this.queryParams();
    const category = params?.get('category');
    const page = this.currentPage();
    const limit = this.limit();

    return [
      `page=${page}`,
      `limit=${limit}`,
      `category=${category === 'all' || !category ? '' : category}`,
      `badge=${params?.getAll('badge').join(',') || ''}`,
      `priceMin=${params?.get('priceMin') || ''}`,
      `priceMax=${params?.get('priceMax') || ''}`,
      `sort=${params?.get('sort') || ''}`,
    ].filter((q) => {
      const value = q.split('=')[1];
      return value !== '' && value !== undefined;
    });
  });

  constructor() {
    // Автоматическая загрузка при изменении query параметров
    effect(() => {
      const query = this.filterQuery();
      if (query.length > 0) {
        this.getProductsByFilter();
      }
    });
  }

  private getProductsByFilter() {
    this.isLoading.set(true);
    
    this.productsService
      .getProducts(this.filterQuery())
      .pipe(
        debounceTime(100),
        catchError((err) => {
          console.error('Error loading products:', err);
          this.isLoading.set(false);
          return of({ data: [], pagination: {} as Pagination });
        })
      )
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.products.set(res.data);
          this.pagination.set(res.pagination);
        },
      });
  }

  // ============================================
  // МЕТОДЫ ДЛЯ ИЗМЕНЕНИЯ ФИЛЬТРОВ (с сбросом page на 1)
  // ============================================

  /**
   * Устанавливает категорию и сбрасывает страницу на 1
   */
  setCategory(category: string) {
    this.updateQueryParams({ category, page: '1' });
  }

  /**
   * Устанавливает badges и сбрасывает страницу на 1
   */
  setBadges(badges: string[]) {
    const params: Record<string, string> = { page: '1' };
    
    if (badges.length > 0) {
      params['badge'] = badges.join(',');
    } else {
      // Если badges пустой, удаляем параметр из URL
      this.removeQueryParam('badge');
      return;
    }
    
    this.updateQueryParams(params);
  }

  /**
   * Устанавливает диапазон цен и сбрасывает страницу на 1
   */
  setPriceRange(min: string, max: string) {
    const params: Record<string, string> = { page: '1' };
    
    if (min) params['priceMin'] = min;
    if (max) params['priceMax'] = max;
    
    this.updateQueryParams(params);
  }

  /**
   * Очищает фильтр цен
   */
  clearPriceFilter() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { priceMin: null, priceMax: null, page: '1' },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Устанавливает сортировку и сбрасывает страницу на 1
   */
  setSort(sort: string) {
    this.updateQueryParams({ sort, page: '1' });
  }

  /**
   * Устанавливает лимит на странице и сбрасывает страницу на 1
   */
  setLimit(limit: number) {
    this.updateQueryParams({ limit: limit.toString(), page: '1' });
  }

  // ============================================
  // МЕТОДЫ ДЛЯ ПАГИНАЦИИ (НЕ сбрасывают page)
  // ============================================

  /**
   * Переход на конкретную страницу
   */
  goToPage(page: number) {
    const totalPages = this.pagination().totalPages || 1;
    
    if (page < 1 || page > totalPages) {
      return;
    }

    this.updateQueryParams({ page: page.toString() });
  }

  /**
   * Следующая страница
   */
  nextPage() {
    const current = this.currentPage();
    const hasNext = this.pagination().hasNextPage;
    
    if (hasNext) {
      this.goToPage(current + 1);
    }
  }

  /**
   * Предыдущая страница
   */
  previousPage() {
    const current = this.currentPage();
    const hasPrev = this.pagination().hasPreviousPage;
    
    if (hasPrev) {
      this.goToPage(current - 1);
    }
  }

  // ============================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ============================================

  private updateQueryParams(params: Record<string, string>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  private removeQueryParam(param: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [param]: null, page: '1' },
      queryParamsHandling: 'merge',
    });
  }

  setProductsContainerWidth(width: number) {
    this.productsContainerWidth.set(width);
  }

  setUserPrefferedView(selectedView: View) {
    this.userPrefferedView.set(selectedView);
  }

  setFiltersSidebar(sidenav: MatSidenav) {
    this.filtersSidenavSubject.next(sidenav);
  }
}