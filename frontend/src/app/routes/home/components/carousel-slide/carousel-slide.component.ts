import { NgStyle } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselSlide } from '../../../../core/services/slider.service';

@Component({
  selector: 'app-carousel-slide',
  imports: [
    // NgStyle
  ],
  templateUrl: './carousel-slide.component.html',
  styleUrl: './carousel-slide.component.scss'
})


export class CarouselSlideComponent {
  @Input() slide!: CarouselSlide

  private readonly router = inject(Router)

  navigateByLink(link: string) {
    // const deltaX = this.mouseStartX - this.mouseEndX
    // const deltaY = this.mouseStartY - this.mouseEndY

    // if (
    //   (Math.abs(deltaX) < this.dragMinDistance)
    //   && (Math.abs(deltaY) < this.dragMinDistance)
    // ) {
      this.router.navigate([link], {
        queryParamsHandling: 'merge'
      }).then()
    // }
  }
}
