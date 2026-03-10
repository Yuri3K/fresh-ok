import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ProductsService } from '../products.service';
import { Pagination, Product } from '@shared/models';
import { debounceTime, finalize } from 'rxjs';
import { CatalogItem, CatalogService } from '../catalog.service';
import { ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoryStateService {
  private readonly productsService = inject(ProductsService);
  private readonly catalogService = inject(CatalogService)

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

  private readonly currentPage = computed(() => {
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

    if(!category) return []

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

  resetState() {
    this._products.set([])
    this.params.set(null)
    this.queryParams.set(null)
  }
}
