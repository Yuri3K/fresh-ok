import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, pipe, take, tap } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { environment } from '../../../../../../environments/environment';

export interface Sponsor {
  id: string
  path: string
  order: number
  createdAt: string
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class SponsorsService {
  apiService = inject(ApiService)

  sponsors = signal<string[]>([])

  constructor() {
    this.getSponsorsData().subscribe()
  }

  getSponsorsData(): Observable<string[]> {
    return this.apiService.getWithoutToken<Sponsor[]>('/sponsors')
      .pipe(
        take(1),
        map(sponsors => sponsors.map(s => environment.mediaUrl + s.path)),
        tap(pathsArr => this.sponsors.set(pathsArr))
      )

  }
}
