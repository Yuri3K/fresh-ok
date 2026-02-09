import { Component } from '@angular/core';
import { NgxCarouselComponent, NgxCarouselConfig } from 'ngx-freshok-carousel';

@Component({
  selector: 'app-product-carousel',
  imports: [
    NgxCarouselComponent,
  ],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss'
})
export class ProductCarouselComponent {
  readonly config: NgxCarouselConfig = {
    mode: 'carousel',
    slidesToShow: 1,
    showDots: false,
    showArrows: true,
    loop: true,
  }

}
// asd