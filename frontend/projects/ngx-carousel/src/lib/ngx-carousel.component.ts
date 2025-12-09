import { AfterContentInit, AfterViewInit, Component, ContentChild, ElementRef, inject, Input, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NgxCarouselControlsComponent } from './ngx-carousel-controls/ngx-carousel-controls.component';
import { NgxCarouselService } from './services/ngx-carousel.service';
import { NgxAutoplayService } from './services/ngx-autoplay.service';
import { NgxSwipeService } from './services/ngx-swipe.service';



@Component({
  selector: 'lib-ngx-carousel',
  imports: [
    NgTemplateOutlet,
    NgxCarouselControlsComponent,
],
  templateUrl: './ngx-carousel.component.html',
  styleUrl: './ngx-carousel.component.scss',
})
export class NgxCarouselComponent implements AfterViewInit, AfterContentInit {
  // @ContentChildren(NgxCarouselSlideComponent) slidesList!: QueryList<NgxCarouselSlideComponent>
  @Input() slidesList!: any[];
  @ViewChild('carouselList', { static: true }) carouselList!: ElementRef<HTMLDivElement>;
  @ContentChild('slideTemplate', { static: true }) slideTemplateRef!: TemplateRef<any>;

  private renderer = inject(Renderer2)

  carousel = inject(NgxCarouselService)
  autoplay = inject(NgxAutoplayService)
  swipe = inject(NgxSwipeService)
  
  ngAfterViewInit() {
    this.swipe.registerSlideList(this.carouselList)
    this.swipe.setRenderer(this.renderer)
    this.carousel.registerCarouselList(this.carouselList.nativeElement, this.renderer)
  }
  
  ngAfterContentInit() {
    // this.carousel.register(this.slidesList.toArray())
    this.carousel.register(this.slidesList, this.slideTemplateRef)
  }
}
