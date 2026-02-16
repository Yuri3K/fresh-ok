import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { TranslateModule } from '@ngx-translate/core';
import { ExpantionPanelComponent } from '../../expantion-panel/expantion-panel.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CatalogStateService } from '../../../../core/services/catalog-state.service';
import { PriceFacade } from './price.facade';

@Component({
  selector: 'app-price-filter',
  imports: [
    MatSliderModule,
    FormsModule,
    MatInputModule,
    TranslateModule,
    ExpantionPanelComponent,
  ],
  providers: [PriceFacade],
  templateUrl: './price-filter.component.html',
  styleUrl: './price-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceFilterComponent {
  stateService = inject(CatalogStateService)
  priceFacade = inject(PriceFacade)

  range = this.priceFacade.range

  onStartValueChange(value: string) {
    const parsedValue = parseInt(value, 10)
    if (!isNaN(parsedValue)) {
      this.priceFacade.setStartValue(parsedValue)
    }
  }

  onEndValueChanged(value: string) {
    const parsedValue = parseInt(value, 10)
    if (!isNaN(parsedValue)) {
      this.priceFacade.setEndValue(parsedValue)
    }
  }

  onDragStart() {
    this.priceFacade.setDragging(true)
  }

  onDragEnd() {
    this.priceFacade.setDragging(false)
  }

  onInputFocus() {
    this.priceFacade.setInputEditing(true)
  }

  onInputBlur() {
    this.priceFacade.setInputEditing(false)
  }
}
