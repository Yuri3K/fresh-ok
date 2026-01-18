import { Component, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatAccordion } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { filter, map } from 'rxjs';
import { CatalogService } from '../../../../core/services/catalog.service';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { TranslateModule } from '@ngx-translate/core';
import { BtnRaisedComponent } from '../../../ui-elems/buttons/btn-raised/btn-raised.component';
import { ExpantionPanelComponent } from '../../expantion-panel/expantion-panel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogStateService } from '../../../../core/services/products-state.service';

@Component({
  selector: 'app-catalog-filters',
  imports: [
    MatIconModule,
    TranslateModule,
    BtnRaisedComponent,
    ExpantionPanelComponent,
  ],
  templateUrl: './catalog-filter.component.html',
  styleUrl: './catalog-filter.component.scss',
})
export class CatalogFilterComponent {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private catalogService = inject(CatalogService);
  private stateService = inject(CatalogStateService)
  readonly currentLang = inject(GetCurrentLangService).currentLang;

  readonly selectedCategory = this.stateService.selectedCategory

  categories = toSignal(
    this.catalogService.catalogList$.pipe(filter((items) => !!items.length)),
    { initialValue: [] },
  );

  onCategorySelect(categoryId: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryId },
      queryParamsHandling: 'merge', // Сохраняет остальные query параметры
    });
  }
}
