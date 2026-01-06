import { Component, DestroyRef, inject } from '@angular/core';
import { SliderService } from './services/slider.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { CarouselSlideComponent } from './carousel-slide/carousel-slide.component';
import { NgxCarouselComponent } from 'ngx-freshok-carousel';
import { MiniFabBtnComponent } from '../../../../shared/ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';

@Component({
  selector: 'app-main-carousel',
  imports: [
    TranslateModule,
    AsyncPipe,
    CarouselSlideComponent,
    NgxCarouselComponent,
    MiniFabBtnComponent,
  ],
  templateUrl: './main-carousel.component.html',
  styleUrl: './main-carousel.component.scss'
})
export class MainCarouselComponent {
  private readonly sliderService = inject(SliderService)
  private destroyRef = inject(DestroyRef)

  slides$ = this.sliderService.slides$

  config = this.sliderService.config

  ngOnInit() {
    this.fetchSlides()
  }

  private fetchSlides() {
    this.sliderService.getSliderData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }
}
