import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  catchError,
  Observable,
  retry,
  take,
  throwError,
} from 'rxjs';
import { PaginatedResponse, Product } from '@shared/models';



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
