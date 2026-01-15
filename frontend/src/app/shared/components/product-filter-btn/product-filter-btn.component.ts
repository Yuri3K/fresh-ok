import { Component, computed, EventEmitter, input, Output } from '@angular/core';
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
})
export class ProductFilterBtnComponent {
  @Output() filterBtnClicked = new EventEmitter<string>();

  isActive = input<boolean>(false);
  btnData = input.required<FilterData>();

  btnText = computed(() => {
    console.log("🚀 ~ this.btnData():", this.btnData())
    return this.btnData().name
  })
}
