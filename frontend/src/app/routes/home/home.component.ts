import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { SliderService } from './components/main-carousel/services/slider.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdvantagesComponent } from './components/advantages/advantages.component';
import { NewsComponent } from './components/news/news.component';
import { MainCarouselComponent } from './components/main-carousel/main-carousel.component';
import { SponsorsCarouselComponent } from './components/sponsors-carousel/sponsors-carousel.component';

@Component({
  selector: 'app-home',
  imports: [
    MainCarouselComponent,
    AdvantagesComponent,
    SponsorsCarouselComponent,
    NewsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


}
