import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SliderService } from '../../core/services/slider.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, CommonModule } from '@angular/common';
// import { CarouselComponent } from 'carousel';
// import { M3CarouselComponent } from '../../../../projects/m3-carousel/src/public-api';
import { CarouselSlideComponent } from './components/carousel-slide/carousel-slide.component';
import { NgxCarouselComponent, NgxCarouselSLideDirective } from 'ngx-carousel';

@Component({
  selector: 'app-home',
  imports: [
    TranslateModule,
    // CarouselComponent,
    AsyncPipe,
    // M3CarouselComponent,
    CommonModule,
    NgxCarouselComponent,
    CarouselSlideComponent,
    // NgxCarouselSLideDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly sliderService = inject(SliderService)
  private destroyRef = inject(DestroyRef)

  slides$ = this.sliderService.slides$

  ngOnInit() {
    this.fetchSlides()
  }

  private fetchSlides() {
    this.sliderService.getSliderData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

}
