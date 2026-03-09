import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ProductsService } from '@core/services/products.service';
import { Pagination, Product } from '@shared/models';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-admin-category',
  imports: [],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.scss'
})
export class AdminCategoryComponent {
  private readonly apiService = inject(ApiService)
  private readonly route = inject(ActivatedRoute)
  private readonly productsService = inject(ProductsService);

  protected readonly isLoading = signal(false);
  protected readonly productsList = signal<Product[]>([])
  protected readonly pagination = signal<Pagination>({} as Pagination)

  private readonly params = toSignal(
    this.route.paramMap.pipe(
      distinctUntilChanged(), //для избежания дублирующих запросов
    ),
    { requireSync: true }
  );

  private readonly queryParams = toSignal(
    this.route.queryParamMap.pipe(
      distinctUntilChanged(), //для избежания дублирующих запросов
    ),
    { requireSync: true }
  );

  private readonly currentPage = computed(() => {
    const page = this.queryParams()?.get('page');
    return page ? parseInt(page, 10) : 1;
  });

  private readonly filterQuery = computed(() => {
    const category = this.params().get('slug');
    const page = this.currentPage();

    return [
      `page=${page}`,
      `limit=3`,
      `category=${category === 'all' || !category ? '' : category}`,
    ]
  });

   constructor() {
    effect(() => {
      console.log("🚀 ~ this.filterQuery():", this.filterQuery())
      if (this.filterQuery()) this.getProductsByFilter();
    });
  }

  private getProductsByFilter() {
    this.isLoading.set(true);

    this.productsService
      .getProducts(this.filterQuery())
      .pipe(debounceTime(100))
      .subscribe({
        next: (res) => {
          console.log("🚀 ~ res:", res)
          this.isLoading.set(false);
          this.productsList.set(res.data);
          this.pagination.set(res.pagination);
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.isLoading.set(false);
        },
      });
  }
}
