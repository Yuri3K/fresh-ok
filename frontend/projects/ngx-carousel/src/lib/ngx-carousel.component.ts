import { AfterViewInit, Component, ContentChildren, ElementRef, inject, QueryList, Renderer2, signal, ViewChild } from '@angular/core';
import { NgxCarouselSlideComponent } from '../lib/ngx-carousel-slide/ngx-carousel-slide.component';
import { NgTemplateOutlet } from '@angular/common';
import { NgxCarouselControlsComponent } from './ngx-carousel-controls/ngx-carousel-controls.component';
import { NgxCarouselService } from './services/ngx-carousel.service';
import { NgxAutoplayService } from './services/ngx-autoplay.service';
import { NgxSwipeService } from './services/ngx-swipe.service';



@Component({
  selector: 'lib-ngx-carousel',
  imports: [
    NgTemplateOutlet,
    NgxCarouselControlsComponent
],
  templateUrl: './ngx-carousel.component.html',
  styleUrl: './ngx-carousel.component.scss',
})
export class NgxCarouselComponent implements AfterViewInit {
  @ContentChildren(NgxCarouselSlideComponent) slidesList!: QueryList<NgxCarouselSlideComponent>
  @ViewChild('carouselList') carouselList!: ElementRef<HTMLDivElement>;

  private renderer = inject(Renderer2)

  carousel = inject(NgxCarouselService)
  autoplay = inject(NgxAutoplayService)
  swipe = inject(NgxSwipeService)
  
  ngAfterViewInit() {
    this.carousel.register(this.slidesList.toArray())
    this.swipe.registerSlideList(this.carouselList)
    this.swipe.setRenderer(this.renderer)
  }
}
