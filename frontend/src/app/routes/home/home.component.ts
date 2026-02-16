import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdvantagesComponent } from './components/advantages/advantages.component';
import { NewsComponent } from './components/news/news.component';
import { MainCarouselComponent } from './components/main-carousel/main-carousel.component';
import { SponsorsCarouselComponent } from './components/sponsors-carousel/sponsors-carousel.component';
import { BannersComponent } from './components/banners/banners.component';
import { HitProductsComponent } from '../../shared/components/hit-products/hit-products.component';
import { PromoComponent } from '../../shared/components/promo/promo.component';

@Component({
  selector: 'app-home',
  imports: [
    MainCarouselComponent,
    HitProductsComponent,
    AdvantagesComponent,
    SponsorsCarouselComponent,
    NewsComponent,
    BannersComponent,
    PromoComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {


}
