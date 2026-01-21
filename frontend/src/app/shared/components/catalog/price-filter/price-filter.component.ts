import { Component } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { TranslateModule } from '@ngx-translate/core';
import { ExpantionPanelComponent } from '../../expantion-panel/expantion-panel.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-price-filter',
  imports: [
    MatSliderModule,
    FormsModule,
    MatInputModule,
    TranslateModule,
    ExpantionPanelComponent,
  ],
  templateUrl: './price-filter.component.html',
  styleUrl: './price-filter.component.scss'
})
export class PriceFilterComponent {
  priceMin = 0
  priceMax = 5500

  startValue = 0
  endValue = 5500

  // Обработка изменения стартового значения через слайдер
  onStartValueChange(value: number) {
    // Проверяем, чтобы стартовое значение не превышало конечное
    if (value > this.endValue) {
      this.startValue = this.endValue
    }
  }

  // Обработка изменения конечного значения через слайдер
  onEndValueChange(value: number) {
    // Проверяем, чтобы конечное значение не было меньше стартового
    if (value < this.startValue) {
      this.endValue = this.startValue
    }
  }

  // Обработка изменения стартового значения через инпут
  onStartInputChange(value: number) {
    // Валидация границ
    if (value < this.priceMin) {
      this.startValue = this.priceMin
    } else if (value > this.endValue) {
      this.startValue = this.endValue;
    }
  }

  // Обработка изменения конечного значения через инпут
  onEndInputChange(value: number): void {
    // Валидация границ
    if (value > this.priceMax) {
      this.endValue = this.priceMax;
    } else if (value < this.startValue) {
      this.endValue = this.startValue;
    }
  }
}
