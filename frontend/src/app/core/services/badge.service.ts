import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Badge } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private readonly apiServie = inject(ApiService);

  badges = toSignal(
    this.apiServie
      .getWithoutToken<Badge[]>('/badges')
      .pipe(filter((badges) => badges.length > 1)),
    { initialValue: [] },
  );
}
