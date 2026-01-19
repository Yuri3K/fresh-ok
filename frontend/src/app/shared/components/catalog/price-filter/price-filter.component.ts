import { Component } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { TranslateModule } from '@ngx-translate/core';
import { ExpantionPanelComponent } from '../../expantion-panel/expantion-panel.component';

@Component({
  selector: 'app-price-filter',
  imports: [
    MatSliderModule,
    TranslateModule,
    ExpantionPanelComponent
  ],
  templateUrl: './price-filter.component.html',
  styleUrl: './price-filter.component.scss'
})
export class PriceFilterComponent {

}
