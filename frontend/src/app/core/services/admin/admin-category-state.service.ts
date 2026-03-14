import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ProductsService } from '../products.service';
import { Pagination, Product } from '@shared/models';
import { debounceTime, finalize } from 'rxjs';
import { CatalogItem, CatalogService } from '../catalog.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RestoreScrollService } from '../restore-scroll.service';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoryStateService {
  private readonly productsService = inject(ProductsService);
  private readonly catalogService = inject(CatalogService)
  private readonly restoreScrollService = inject(RestoreScrollService)
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly adminCategories = this.catalogService.catalogListAdmin
  private readonly _products = signal<Product[]>([]);
  readonly isLoading = signal(false);
  readonly pagination = signal<Pagination>({} as Pagination);

  readonly currentCategory = computed<CatalogItem | undefined>(() => {
    return this.adminCategories().find(c => c.slug == this.params()?.get('slug'))
  })

  readonly products = this._products.asReadonly()

  private readonly params = signal<ParamMap | null>(null);
  private readonly queryParams = signal<ParamMap | null>(null);

  readonly currentPage = computed(() => {
    const page = this.queryParams()?.get('page');
    return page ? parseInt(page, 10) : 1;
  });

  private readonly limit = computed(() => {
    const limit = this.queryParams()?.get('limit');
    return limit ? parseInt(limit, 10) : 3;
  });

  private readonly filterQuery = computed(() => {
    const category = this.params()?.get('slug');
    const page = this.currentPage();
    const limit = this.limit();

    if (!category) return []

    return [
      `page=${page}`,
      `limit=${limit}`,
      `category=${category === 'all' ? '' : category}`,
    ]
  });


  constructor() {
    this.catalogService.getCatalogListAdmin().subscribe()

    effect(() => {
      if (this.filterQuery().length) this.getProductsByFilter();
    });
  }

  private getProductsByFilter() {
    this.isLoading.set(true);

    this.productsService
      .getProducts(this.filterQuery())
      .pipe(
        debounceTime(100),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this._products.set(res.data);
          this.pagination.set(res.pagination);
        },
        error: (err) => {
          console.error('Error loading products:', err);
        },
      });
  }

  setParams(params: ParamMap) {
    this.params.set(params)
  }

  setQueryParams(queryParams: ParamMap) {
    this.queryParams.set(queryParams)
  }

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


  private updateQueryParams(params: Record<string, string>) {
    // setTimeout нужен для того, что когда регистрируются компоненты,
    // например sort-by и limit-by (и остальные фильтры, которые добавляют
    // в url свои queryParams для фильтрации), то они практически одновременно
    // переписывают url и перезатирают сами друг друга, что приводит к потере 
    // некоторых queryParams в url. setTimeout решает эту проблему
    setTimeout(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: params,
        queryParamsHandling: 'merge',
      }).then(() => this.restoreScrollService.restoreScroll());
    }, 0);
  }

  resetState() {
    this._products.set([])
    this.params.set(null)
    this.queryParams.set(null)
  }
}
