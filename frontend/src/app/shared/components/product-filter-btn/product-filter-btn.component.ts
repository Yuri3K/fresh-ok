import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { BtnFlatComponent } from '../../ui-elems/buttons/btn-flat/btn-flat.component';
import { GetCurrentLangService } from '../../../core/services/get-current-lang.service';
import { CatalogItem } from '../../../core/services/catalog.service';

@Component({
  selector: 'app-product-filter-btn',
  imports: [BtnFlatComponent],
  templateUrl: './product-filter-btn.component.html',
  styleUrl: './product-filter-btn.component.scss',
})
export class ProductFilterBtnComponent {
  @Output() filterBtnClicked = new EventEmitter<string>();

  isActive = input<boolean>(false);

  btnData = input.required<CatalogItem>();

  readonly currentLang = inject(GetCurrentLangService).currentLang;
}
