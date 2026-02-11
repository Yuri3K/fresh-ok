import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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

  stars = computed(() => {
    const rating = this.starsCount();
    const fullStars = Math.floor(rating);
    const decimal = rating - fullStars;
    const fillPercentage = decimal * 100;
    
    return Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return { fillPercentage: 100 }; // полностью заполненная звезда
      } else if (index === fullStars && decimal > 0) {
        return { fillPercentage }; // частично заполненная звезда
      } else {
        return { fillPercentage: 0 }; // пустая звезда
      }
    });
  });
}
// ghj
