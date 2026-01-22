import { NgStyle } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { CarouselSlide } from '../services/slider.service';
import { LangRouterService } from '../../../../../core/services/langs/lang-router.service';

@Component({
  selector: 'app-carousel-slide',
  imports: [
    NgStyle
  ],
  templateUrl: './carousel-slide.component.html',
  styleUrl: './carousel-slide.component.scss'
})


export class CarouselSlideComponent {
  @Input() slide!: CarouselSlide

  private navigateService = inject(LangRouterService)

  navigateByLink(link: string) {
      this.navigateService.navigateByUrl(link, {
        queryParamsHandling: 'merge'
      }).then()
  }
}
