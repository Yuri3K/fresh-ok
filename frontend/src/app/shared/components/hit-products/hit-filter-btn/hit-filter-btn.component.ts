import { Component, EventEmitter, input, Output } from '@angular/core';
import { BtnFlatComponent } from '../../../ui-elems/buttons/btn-flat/btn-flat.component';

interface HitFilterItem {
  name: string;
  order: number;
  selector: string;
}

@Component({
  selector: 'app-hit-filter-btn',
  imports: [BtnFlatComponent],
  templateUrl: './hit-filter-btn.component.html',
  styleUrl: './hit-filter-btn.component.scss',
})
export class HitFilterBtnComponent {
  @Output() filterBtnClicked = new EventEmitter<string>()

  isActive = input<boolean>(false)

  btnData = input.required<HitFilterItem>();
}
