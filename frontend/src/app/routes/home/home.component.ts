import { Component } from '@angular/core';
import { AdvantagesComponent } from './components/advantages/advantages.component';
import { NewsComponent } from './components/news/news.component';
import { MainCarouselComponent } from './components/main-carousel/main-carousel.component';
import { SponsorsCarouselComponent } from './components/sponsors-carousel/sponsors-carousel.component';
import { BannersComponent } from './components/banners/banners.component';

@Component({
  selector: 'app-home',
  imports: [
    MainCarouselComponent,
    AdvantagesComponent,
    SponsorsCarouselComponent,
    NewsComponent,
    BannersComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


}
