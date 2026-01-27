import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { LangCode } from './langs/langs.service';
import {
  catchError,
  Observable,
  retry,
  take,
  tap,
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
  characteristics: Record<LangCode, CharacteristicItem[]>;
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Timestamp {
  _seconds: number
  _nanoseconds: number
}

export interface CharacteristicItem {
  name: string,
  value: string
}

export interface Review {
  productId: string;
  userId: string;
  userAvatar: string;
  userName: string;
  text: string;
  rating: number;
  createdAt: Timestamp;
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  priority: number;
  slug: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
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
        // tap((prod) => console.log(prod)),
        catchError((err) => {
          console.log(err);
          return throwError(() => err);
        })
      )
  }
}
