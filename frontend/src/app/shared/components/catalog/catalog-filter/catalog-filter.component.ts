import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';
import { CatalogService } from '../../../../core/services/catalog.service';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { TranslateModule } from '@ngx-translate/core';
import { BtnRaisedComponent } from '../../../ui-elems/buttons/btn-raised/btn-raised.component';
import { ExpantionPanelComponent } from '../../expantion-panel/expantion-panel.component';
import { CatalogStateService } from '../../../../core/services/catalog-state.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogFilterComponent {
  private catalogService = inject(CatalogService);
  private stateService = inject(CatalogStateService);
  readonly currentLang = inject(GetCurrentLangService).currentLang;

  readonly selectedCategory = this.stateService.selectedCategory;

  categories = toSignal(
    this.catalogService.catalogList$.pipe(filter((items) => !!items.length)),
    { initialValue: [] },
  );

  onCategorySelect(categorySlug: string): void {
    // Используем метод сервиса, который автоматически сбросит page на 1
    this.stateService.setCategory(categorySlug);
  }
}
