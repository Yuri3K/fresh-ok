import { Component, input } from '@angular/core';
import { BtnFlatComponent } from '../../../ui-elems/buttons/btn-flat/btn-flat.component';

@Component({
  selector: 'app-hit-filter-btn',
  imports: [
    BtnFlatComponent,
  ],
  templateUrl: './hit-filter-btn.component.html',
  styleUrl: './hit-filter-btn.component.scss'
})
export class HitFilterBtnComponent {
  text = input.required<string>()
}
