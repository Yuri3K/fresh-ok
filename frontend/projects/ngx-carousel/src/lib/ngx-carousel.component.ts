import { AfterViewInit, Component, ContentChildren, QueryList, signal } from '@angular/core';
import { NgxCarouselSlideComponent } from '../lib/ngx-carousel-slide/ngx-carousel-slide.component';
import { NgTemplateOutlet } from '@angular/common';
import { ɵEmptyOutletComponent } from "@angular/router";
import { NgxCarouselSLideDirective } from './ngx-carousel-slide.directive';


@Component({
  selector: 'lib-ngx-carousel',
  imports: [
    NgTemplateOutlet,
],
  templateUrl: './ngx-carousel.component.html',
  styleUrl: './ngx-carousel.component.scss',
})
export class NgxCarouselComponent {
  @ContentChildren(NgxCarouselSlideComponent) slidesList!: QueryList<NgxCarouselSlideComponent>

  currentSlide = signal(0);
}
