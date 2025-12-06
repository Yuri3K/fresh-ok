import { AfterViewInit, Component, ContentChildren, inject, QueryList, signal } from '@angular/core';
import { NgxCarouselSlideComponent } from '../lib/ngx-carousel-slide/ngx-carousel-slide.component';
import { NgTemplateOutlet } from '@angular/common';
import { NgxCarouselControlsComponent } from './ngx-carousel-controls/ngx-carousel-controls.component';
import { NgxCarouselService } from './ngx-carousel.service';



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

  carousel = inject(NgxCarouselService)
  
  ngAfterViewInit() {
    this.carousel.register(this.slidesList.toArray())
  }
}
