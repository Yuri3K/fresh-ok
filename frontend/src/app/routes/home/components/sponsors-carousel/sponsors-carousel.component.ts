import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SponsorsService } from './services/sponsors.service';
import { SponsorsSlideComponent } from './sponsors-slide/sponsors-slide.component';
import { NgxCarouselComponent } from 'ngx-freshok-carousel';
import { MiniFabBtnComponent } from '../../../../shared/ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';

@Component({
  selector: 'app-sponsors-carousel',
  imports: [
    SponsorsSlideComponent,
    NgxCarouselComponent,
    MiniFabBtnComponent
  ],
  templateUrl: './sponsors-carousel.component.html',
  styleUrl: './sponsors-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorsCarouselComponent {
  sponsorsService = inject(SponsorsService)
  sponsors = this.sponsorsService.sponsors
  config = this.sponsorsService.config
}
