import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { LangCode } from './langs/langs.service';
import {
  catchError,
  Observable,
  retry,
  take,
  throwError,
} from 'rxjs';

export interface Product {
  id: string;
  publicId: string;
  badges: Badge[];
  category: string;
  currency: string;
  discountPercent: number;
  hasDiscount: boolean;
  i18n: Record<LangCode, ProductTexts>;
  description: Record<LangCode, string>;
  characteristics: Record<LangCode, Record<string, string>>;
  isActive: boolean;
  isHit: boolean;
  isNew: boolean;
  price: number;
  searchKeywords: string[];
  slug: string;
  stock: Stock;
  rate: number;
  reviewsCount: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  productId: string;
  userId: string;
  userAvatar: string;
  userName: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface PaginatedResponse<Product> {
  data: Product[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Stock {
  i18n: Record<LangCode, stockStatus>;
  slug: stockStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type stockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface ProductTexts {
  name: string;
  description: string;
}

export interface Badge {
  id: string;
  color: string;
  i18n: Record<LangCode, string>;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
  priority: number;
  slug: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiService = inject(ApiService);

  getProducts(queryStr: string[]): Observable<PaginatedResponse<Product>> {
    return this.apiService
      .getWithoutToken<PaginatedResponse<Product>>('/products', queryStr)
      .pipe(
        retry(1), // при неeдачном запросе попробовать еще раз
        take(1),
        // tap(res => console.log("!!! PRODUCTS !!!", res)),
        catchError((err) => {
          console.log(err);
          return throwError(() => err);
        })
      );
  }

  getProductBySlug(productSlug: string): Observable<Product> {
    return this.apiService.getWithoutToken<Product>(`/products/${productSlug}`)
      .pipe(
        retry(1),
        take(1),
        catchError((err) => {
          console.log(err);
          return throwError(() => err);
        })
      )
  }
}
