import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-stars',
  imports: [MatIconModule],
  templateUrl: './product-stars.component.html',
  styleUrl: './product-stars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductStarsComponent {
  starsCount = input.required<number>()
}
// ghj

  // // массив с процентами закрашивания для каждой звезды 
  // starFill = computed(() => {
  //   const value = this.starsCount();
  //   return Array.from({ length: 5 }, (_, i) => {
  //     const diff = value - i;
  //     if (diff >= 1) return 1;  // полная 
  //     if (diff > 0) return diff;  // дробная часть (0..1) 
  //     return 0; // пустая 
  //   });
  // });

  // getGradient(fill: number): string {
  //   if (fill === 1) {
  //     return 'gold';
  //   }

  //   if (fill === 0) {
  //     return 'gray';
  //   }
  //   const percent = fill * 100;

  //   return `linear-gradient(90deg, gold ${percent}%, gray ${percent}%)`;
  // }
