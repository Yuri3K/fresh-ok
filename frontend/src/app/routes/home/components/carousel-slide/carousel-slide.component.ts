import { NgStyle } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselSlide } from '../../../../core/services/slider.service';

@Component({
  selector: 'app-carousel-slide',
  imports: [
    NgStyle
  ],
  templateUrl: './carousel-slide.component.html',
  styleUrl: './carousel-slide.component.scss'
})


export class CarouselSlideComponent {
  @Input() slide!: CarouselSlide

  private readonly router = inject(Router)

  navigateByLink(link: string) {
      console.log("!!! CLICK !!!")

      this.router.navigate(['/user'], {
        queryParamsHandling: 'merge'
      }).then()
  }
}
