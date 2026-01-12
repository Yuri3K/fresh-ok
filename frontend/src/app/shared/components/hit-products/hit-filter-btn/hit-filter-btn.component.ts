import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { BtnFlatComponent } from '../../../ui-elems/buttons/btn-flat/btn-flat.component';
import { CatalogItem } from '../../../../core/services/catalog.service';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';

@Component({
  selector: 'app-hit-filter-btn',
  imports: [BtnFlatComponent],
  templateUrl: './hit-filter-btn.component.html',
  styleUrl: './hit-filter-btn.component.scss',
})
export class HitFilterBtnComponent {
  @Output() filterBtnClicked = new EventEmitter<string>();

  isActive = input<boolean>(false);

  btnData = input.required<CatalogItem>();

  readonly currentLang = inject(GetCurrentLangService).currentLang;
}
