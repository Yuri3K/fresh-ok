import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, catchError, map, take, tap, throwError } from 'rxjs';

export interface CatalogItem {
  id: string
  order: number
  slug: string
  createdAt: string
  updatedAt: string
  name: {
    en: string
    ru: string
    uk: string
  }
}

@Injectable({
  providedIn: 'root'
})

export class CatalogService {
  private readonly apiService = inject(ApiService)

  private readonly catalogListSubject = new BehaviorSubject<CatalogItem[]>([])
  private readonly selectedCategorySubject = new BehaviorSubject<string>('all')

  readonly catalogList$ = this.catalogListSubject.asObservable()
  readonly selectedCategory$ = this.selectedCategorySubject.asObservable()

  constructor() {
    this.getCatalogList().subscribe()
  }

  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category)
  }

  private getCatalogList() {
    return this.apiService.getWithoutToken<CatalogItem[]>('/catalog')
    .pipe(
      take(1),
      tap(catalog => this.catalogListSubject.next(catalog)),
      catchError(err => {
        console.log("Error fetching catalog", err)
        return throwError(() => err)
      })
    )
  }

}
