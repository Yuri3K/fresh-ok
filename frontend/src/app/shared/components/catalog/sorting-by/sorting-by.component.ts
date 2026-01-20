import { Component, computed, effect, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';
import { MatIconModule } from '@angular/material/icon';
import { BtnRaisedComponent } from '../../../ui-elems/buttons/btn-raised/btn-raised.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { CatalogStateService } from '../../../../core/services/products-state.service';

type SortingType =
  | 'rating'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'name-asc'
  | 'name-desc';

interface Sort {
  name: string;
  slug: SortingType;
}
@Component({
  selector: 'app-sorting-by',
  imports: [
    TranslateModule,
    OpenMenuDirective,
    MatIconModule,
    BtnRaisedComponent,
  ],
  templateUrl: './sorting-by.component.html',
  styleUrl: './sorting-by.component.scss',
})
export class SortingByComponent {
  private translateService = inject(TranslateService);
  private stateService = inject(CatalogStateService);

  sorting = toSignal<Sort[]>(
    this.translateService
      .stream('products-page.sorting.sort-by')
      .pipe(
        filter((res): res is Sort[] => Array.isArray(res) && res.length > 0),
      ),
    { requireSync: true }, // гарантирует синхронное значение
  );

  selectedSort = signal<SortingType>('newest');

  itemToShow = computed(() => {
    const sorting = this.sorting();
    const selected = this.selectedSort();
    return sorting.find((s) => s.slug == selected)?.name;
  });

  constructor() {
    effect(() => {
      const sort = this.selectedSort();
      if (sort) {
        this.stateService.setSort(sort);
      }
    });
  }

  setSelectedSort(sort: SortingType) {
    this.selectedSort.set(sort);
  }
}
