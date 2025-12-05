import { Component, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { M3CarouselService } from './m3-carousel.service';
import { M3SwipeDirective } from "./m3-swipe.directive";
import { M3CarouselSlideDirective } from './m3-carousel-slide.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRipple } from "@angular/material/core";

@Component({
  selector: 'm3-carousel',
  imports: [
    M3SwipeDirective,
    M3CarouselSlideDirective,
    MatIconModule,
    MatButtonModule,
    MatRipple
],
  templateUrl: './m3-carousel.component.html',
  styleUrl: './m3-carousel.component.scss',
})

export class M3CarouselComponent implements OnInit, OnDestroy {
  @Input() autoplay?: boolean
  @Input() interval?: number
  @Input() loop?: boolean
  @Input() itemsPerView?: number

  private el = inject(ElementRef<HTMLElement>)
  carouselService = inject(M3CarouselService)

  ngOnInit() {
    this.carouselService.setConfig({
      autoplay: this.autoplay,
      interval: this.interval,
      loop: this.loop
    })
  }

  onSwipeLeft() {
    this.carouselService.next()
  }

  onSwipeRigth() {
    this.carouselService.prev()
  }

  ngOnDestroy() {
    this.carouselService.stopAutoplay()
  }

}
