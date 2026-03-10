import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, catchError, Observable, take, tap, throwError } from 'rxjs';

export interface CatalogItem {
  order: number
  slug: string
  publicId: string
  imgVersion: number
  isPublished: boolean
  name: {
    en: string
    ru: string
    uk: string
  }
  createdAt: number
  updatedAt: number
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
  
  private readonly _catalogListAdmin = signal<CatalogItem[]>([])
  readonly catalogListAdmin = this._catalogListAdmin.asReadonly()

  get categoriesLehgth(): number {
    return this.catalogListSubject.getValue().length
  }

  constructor() {
    this.getCatalogList().subscribe()
  }

  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category)
  }

  getCatalogList() {
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

  getCatalogListAdmin() {
    return this.apiService.get<CatalogItem[]>('/catalog/admin')
      .pipe(
        take(1),
        tap(catalog => {
          this._catalogListAdmin.set(catalog)
        }),
        catchError(err => {
          console.log("Error fetching admin catalog", err)
          return throwError(() => err)
        })
      )
  }

  uploadCategoryImage(file: File, slug: string): Observable<{
    publicId: string
    imgVersion: number
    url: string
  }> {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('slug', slug)

    return this.apiService.post('/category-image', formData)
  }

  createCategory(categoryData: Partial<CatalogItem>): Observable<CatalogItem> {
    return this.apiService.post<CatalogItem>('/catalog/create-category', categoryData)
  }

  editCategory(categoryData: Omit<CatalogItem, 'updatedAt' | 'createdAt'>) {
    return this.apiService.patch<CatalogItem>(`/catalog/${categoryData.slug}`, categoryData)
  }

  removeCategory(slug: CatalogItem['slug']): Observable<any> {
    return this.apiService.delete(`/catalog/${slug}`)
      .pipe(
        catchError(err => {
          console.log("Error fetching catalog", err)
          return throwError(() => err)
        })
      )
  }

}
