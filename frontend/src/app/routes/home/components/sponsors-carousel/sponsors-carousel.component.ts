import { Component, inject } from '@angular/core';
import { SponsorsService } from './services/sponsors.service';

@Component({
  selector: 'app-sponsors-carousel',
  imports: [],
  templateUrl: './sponsors-carousel.component.html',
  styleUrl: './sponsors-carousel.component.scss'
})
export class SponsorsCarouselComponent {
  sponsors = inject(SponsorsService).sponsors
}
