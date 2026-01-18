import { Component, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';
import { CatalogService } from '../../../../core/services/catalog.service';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { H3TitleComponent } from '../../../ui-elems/typography/h3-title/h3-title.component';
import { TranslateModule } from '@ngx-translate/core';
import { BtnRaisedComponent } from '../../../ui-elems/buttons/btn-raised/btn-raised.component';

@Component({
  selector: 'app-catalog-filters',
  imports: [
    MatExpansionModule, 
    MatIconModule,
    H3TitleComponent,
    TranslateModule,
    BtnRaisedComponent
  ],
  templateUrl: './catalog-filters.component.html',
  styleUrl: './catalog-filters.component.scss',
})
export class CatalogFiltersComponent {
  accordion = viewChild.required(MatAccordion);

  catalogService = inject(CatalogService);
  readonly currentLang = inject(GetCurrentLangService).currentLang;

  categories = toSignal(
    this.catalogService.catalogList$.pipe(filter((items) => !!items.length)),
    { initialValue: [] },
  );
}
