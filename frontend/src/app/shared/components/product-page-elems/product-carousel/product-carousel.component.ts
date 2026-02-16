import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { NgxCarouselComponent, NgxCarouselConfig } from 'ngx-freshok-carousel';
import { MEDIA_URL } from '../../../../core/urls';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { ProductSlide, ProductSlideComponent } from './product-slide/product-slide.component';
import { ProductStateService } from '../../../../core/services/product-state.service';


@Component({
  selector: 'app-product-carousel',
  imports: [
    NgxCarouselComponent,
    ProductSlideComponent,
  ],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCarouselComponent {
  product$ = inject(ProductStateService).currentProduct$

  private readonly currentLang = inject(GetCurrentLangService).currentLang;
  
  readonly config: NgxCarouselConfig = {
    mode: 'carousel',
    slidesToShow: 1,
    showDots: false,
    showArrows: true,
    loop: true,
    autoplay: false,
  }

  readonly slides = computed<ProductSlide[]>(() => {
    if (this.product$().id) {
      return [
        {
          imgUrl: `${MEDIA_URL}${this.product$().publicId}-mini`,
          alt: this.product$().i18n[this.currentLang()].name
        },
        {
          imgUrl: `${MEDIA_URL}${this.product$()!.publicId}-1`,
          alt: this.product$().i18n[this.currentLang()].name
        },
        {
          imgUrl: `${MEDIA_URL}${this.product$()!.publicId}-2`,
          alt: this.product$().i18n[this.currentLang()].name
        },
      ]
    } else return []
  })
}
