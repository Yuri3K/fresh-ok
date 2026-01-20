import { Component, computed, effect, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { BtnRaisedComponent } from '../../../ui-elems/buttons/btn-raised/btn-raised.component';
import { filter, tap } from 'rxjs';
import { CatalogStateService } from '../../../../core/services/products-state.service';

type LimitType = "6" | "12" | "18"
interface Limit {
  name: string,
  slug: LimitType
}

@Component({
  selector: 'app-limit-by',
  imports: [
    TranslateModule,
    OpenMenuDirective,
    MatIconModule,
    BtnRaisedComponent,
  ],
  templateUrl: './limit-by.component.html',
  styleUrl: './limit-by.component.scss',
})
export class LimitByComponent {
  private translateService = inject(TranslateService);
  private stateService = inject(CatalogStateService);

  limits = toSignal<Limit[]>(
    this.translateService
      .stream('products-page.sorting.limit')
      .pipe(
        filter((res): res is Limit[] => Array.isArray(res) && res.length > 0)),
    { requireSync: true }, // гарантирует синхронное значение
  );

  selectedLimit = signal<LimitType>('6');

  itemToShow = computed(() => {
    const limit = this.limits()
    const selected = this.selectedLimit()

    return limit.find((l) => l.slug == selected)?.name
  });

  constructor() {
    effect(() => {
      const limit = this.selectedLimit()
      if(limit) {
        this.stateService.setLimit(+limit)
      }
    })
  }

  setSelectedItem(limit: LimitType) {
    this.selectedLimit.set(limit);
  }
}
