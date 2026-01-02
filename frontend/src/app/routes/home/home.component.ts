import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SliderService } from '../../core/services/slider.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CarouselSlideComponent } from './components/carousel-slide/carousel-slide.component';
import { NgxCarouselComponent, NgxCarouselConfig } from 'ngx-freshok-carousel';
import { MiniFabBtnComponent } from '../../shared/ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';

@Component({
  selector: 'app-home',
  imports: [
    TranslateModule,
    AsyncPipe,
    CommonModule,
    CarouselSlideComponent,
    NgxCarouselComponent, 
    MiniFabBtnComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
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
      .subscribe(data => {
        console.log('DATA!!!!!!!', data)
      })
  }

}
