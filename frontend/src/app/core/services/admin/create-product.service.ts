import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateProductService {
  private readonly apiService = inject(ApiService)

  uploadProductImage(
    file: File,
    category: string,
    slug: string
  ): Observable<{
    publicId: string,
    version: number,
    url: string
  }> {
    const formData = new FormData()
    formData.append('image', file),
      formData.append('category', category)
    formData.append('slug', slug)

    return this.apiService.post('/product-image', formData)
  }

  uploadProductSlide(
    file: File,
    category: string,
    slug: string,
    order: number
  ): Observable<{
    publicId: string
    version: number
    order: number
    url: string
  }> {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('category', category)
    formData.append('slug', slug)
    formData.append('order', order.toString())

    return this.apiService.post('/product-slide', formData)
  }

}
