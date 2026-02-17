import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BtnFlatComponent } from '../../ui-elems/buttons/btn-flat/btn-flat.component';

export interface FilterData {
  name: string;
  selector: string;
  order: number;
}
@Component({
  selector: 'app-product-filter-btn',
  imports: [BtnFlatComponent],
  templateUrl: './product-filter-btn.component.html',
  styleUrl: './product-filter-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilterBtnComponent {
  filterBtnClicked = output<string>()

  isActive = input<boolean>(false);
  btnData = input.required<FilterData>();
}
