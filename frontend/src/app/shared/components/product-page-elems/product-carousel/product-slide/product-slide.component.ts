import { Component, input } from '@angular/core';
import {  } from '../../../../../core/services/get-current-lang.service';

export interface ProductSlide {
  imgUrl: string;
  alt: string;
}

@Component({
  selector: 'app-product-slide',
  imports: [],
  templateUrl: './product-slide.component.html',
  styleUrl: './product-slide.component.scss',
})
export class ProductSlideComponent {
  slide = input.required<ProductSlide>()
}
