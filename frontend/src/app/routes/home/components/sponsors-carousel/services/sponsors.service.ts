import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, pipe, take, tap } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { environment } from '../../../../../../environments/environment';
import { MEDIA_URL } from '../../../../../core/urls';

export interface Sponsor {
  id: string;
  path: string;
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

  config = {
    pauseOnHover: false,
    autoplay: true,
    showArrows: false,
    showDots: false,
    slidesToShow: 3,
    speed: 1000,
    interval: 0,
    loop: true,
    breakpoints: [],
  };

  constructor() {
    console.log('CALLED');
    this.getSponsorsData().subscribe((s) => {
      console.log('IN SYB !!!!', s);
    });
  }

  getSponsorsData(): Observable<Partial<Sponsor>[]> {
    return this.apiService.getWithoutToken<Sponsor[]>('/sponsors').pipe(
      take(1),
      // tap(sponsors => console.log('!!! sponsors !!!', sponsors)),
      map((sponsors) =>
        sponsors.map((s) => {
          return {
            path: MEDIA_URL + s.path,
            id: s.id,
          };
        })
      ),
      tap((sponsors) => this.sponsors.set(sponsors))
    );
  }
}
