import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselComponent } from '../../../../projects/carousel/src/public-api';
import { SliderService } from '../../core/services/slider.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, CommonModule } from '@angular/common';
import { M3CarouselComponent } from '../../../../projects/m3-carousel/src/public-api';

@Component({
  selector: 'app-home',
  imports: [
    TranslateModule,
    CarouselComponent,
    AsyncPipe,
    CommonModule,
    M3CarouselComponent
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
