import { inject, Injectable, signal } from '@angular/core';
import { catchError, filter, Observable, of, retry, take, tap } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { MEDIA_URL } from '../../../../../core/urls';

export interface Banner {
  id: string,
  createdAt: string,
  isActive: boolean,
  linkUrl: string,
  order: number,
  publicId: string,
  textColor: string,
  translations: {
    en: Translation,
    ru: Translation,
    uk: Translation,
  }
}

interface Translation {
  title: string,
  subtitle: string,
  announcement: string,
  buttonText: string,
}

@Injectable({
  providedIn: 'root'
})


export class BannersService {
  apiService = inject(ApiService)

  banners = signal<Banner[]>([])

  constructor() {
    this.getBanners().subscribe()
  }

  private getBanners(): Observable<Banner[]> {
    return this.apiService.getWithoutToken<Banner[]>('/banners')
      .pipe(
        // filter(banners => banners.length > 0),
        retry(1), // Повторить 1 раз при ошибке
        take(1),
        tap(banners => {
          if (banners.length > 0) {
            const processedBanners = banners.map(b => {
              return {
                ...b,
                publicId: MEDIA_URL + b.publicId + '.jpg',
              }
            })
            this.banners.set(processedBanners);
          }
        }),
        catchError(error => {
          console.error('Error loading banners after retries:', error);
          return of([]);
        })
      )
  }
}
