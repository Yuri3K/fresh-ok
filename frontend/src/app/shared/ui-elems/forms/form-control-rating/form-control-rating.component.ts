import { Component, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-control-rating',
  imports: [
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './form-control-rating.component.html',
  styleUrl: './form-control-rating.component.scss'
})
export class FormControlRatingComponent {
  starsControl = input.required<FormControl<number>>()
  starsCount = input(5)

  rate = signal(0)
  hoveredIndex = signal<number>(-1);

  starClicked(index: number) {
    this.rate.set(index)
    this.starsControl().setValue(index)
  }

  starHovered(index: number) {
    this.hoveredIndex.set(index);
  }

  starLeave() {
    this.hoveredIndex.set(-1);
  }

  isActive(index: number) { 
    // если есть hover — подсвечиваем до hoveredIndex 
    if (this.hoveredIndex() >= 0) { 
      return index <= this.hoveredIndex(); 
    } 

    // иначе подсвечиваем до выбранного рейтинга
    return index < this.rate(); 
  }
}
