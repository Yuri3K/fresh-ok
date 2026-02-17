import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CarouselSlide } from '../services/slider.service';
import { LangRouterService } from '../../../../../core/services/langs/lang-router.service';
import { RestoreScrollService } from '../../../../../core/services/restore-scroll.service';

@Component({
  selector: 'app-carousel-slide',
  imports: [
    NgStyle
  ],
  templateUrl: './carousel-slide.component.html',
  styleUrl: './carousel-slide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class CarouselSlideComponent {
  slide = input.required<CarouselSlide>()

  private navigateService = inject(LangRouterService)
  private restoreScrollService = inject(RestoreScrollService)

  navigateByLink(link: string) {
      this.navigateService.navigateByUrl(link, {
        queryParamsHandling: 'merge'
      }).then(() => this.restoreScrollService.restoreScroll())
  }
}
