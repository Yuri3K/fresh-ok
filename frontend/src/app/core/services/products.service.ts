import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { LangCode } from './langs.service';
import { catchError, Observable, of, retry, take, tap, throwError } from 'rxjs';

export interface Product {
  id: string;
  badges: Badge[];
  categories: string[];
  currency: string;
  discountPercent: number;
  hasDiscount: boolean;
  i18n: Record<LangCode, string>;
  isActive: boolean;
  isHit: boolean;
  isNew: boolean;
  price: number;
  searchKeywords: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface Badge {
  color: string;
  i18n: Record<LangCode, string>;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
  priority: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiService = inject(ApiService);

  getProducts(queryStr: string[]): Observable<Product[]> {
    return this.apiService.getWithoutToken<Product[]>('/products', queryStr)
      .pipe(
        retry(1),
        take(1),
        catchError((err) => {
          console.log(err)
          return throwError(() => err)
        })
      );
  }
}
