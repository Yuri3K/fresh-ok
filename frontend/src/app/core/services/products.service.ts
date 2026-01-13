import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { LangCode } from './langs.service';
import { catchError, Observable, of, retry, take, tap, throwError } from 'rxjs';

export interface Product {
  id: string;
  publicId: string;
  badges: Badge[];
  category: string;
  currency: string;
  discountPercent: number;
  hasDiscount: boolean;
  i18n: Record<LangCode, ProductTexts>;
  isActive: boolean;
  isHit: boolean;
  isNew: boolean;
  price: number;
  searchKeywords: string[];
  slug: string;
  stock: Stock;
  rate: number;
  createdAt: string;
  updatedAt: string;
}

interface Stock {
  i18n: Record<LangCode, stockStatus>;
  slug: stockStatus
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type stockStatus = 'in stock' | 'low-stock' | 'out-of-stock';

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

  getProducts(queryStr: string[]): Observable<Product[]> {
    return this.apiService
      .getWithoutToken<Product[]>('/products', queryStr)
      .pipe(
        retry(1),
        take(1),
        catchError((err) => {
          console.log(err);
          return throwError(() => err);
        })
      );
  }
}
