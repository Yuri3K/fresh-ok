import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, take, tap } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { MEDIA_URL } from '../../../../../core/urls';
import { NgxCarouselConfig } from 'ngx-freshok-carousel';

export interface Sponsor {
  id: string;
  publicId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class SponsorsService {
  apiService = inject(ApiService);

  sponsors = signal<Partial<Sponsor>[]>([]);

  config: NgxCarouselConfig = {
    mode: 'non-stop',
    nonStopSpeed: 70,
    slidesToShow: 5,
    showDots: false,
    showArrows: false,
    loop: true,
    stopAutoplayBtn: true,
    breakpoints: [
      {
        breakpoint: 1200,  // от 1200 и выше
        slidesToShow: 5,
      },
      {
        breakpoint: 992,  // от 992 и выше
        slidesToShow: 4,
      },
      {
        breakpoint: 768,  // от 768 и выше
        slidesToShow: 3,
      },
      {
        breakpoint: 576,  // от 576 и выше
        slidesToShow: 2,
      },
      {
        breakpoint: 0,  // до 576
        slidesToShow: 1,
      }
    ]
  };

  constructor() {
    this.getSponsorsData().subscribe();
  }

  getSponsorsData(): Observable<Partial<Sponsor>[]> {
    return this.apiService.getWithoutToken<Sponsor[]>('/sponsors').pipe(
      take(1),
      map((sponsors) =>
        sponsors.map((s) => {
          return {
            publicId: MEDIA_URL + s.publicId + '.png',
            id: s.id,
          };
        })
      ),
      tap((sponsors) => this.sponsors.set(sponsors))
    );
  }
}
