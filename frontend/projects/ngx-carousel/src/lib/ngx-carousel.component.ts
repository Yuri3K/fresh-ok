import { AfterViewInit, Component, ContentChildren, QueryList } from '@angular/core';
import { NgxCarouselSLideDirective } from './ngx-carousel-slide.directive';


@Component({
  selector: 'lib-ngx-carousel',
  imports: [],
  templateUrl: './ngx-carousel.component.html',
  styleUrl: './ngx-carousel.component.scss',
})
export class NgxCarouselComponent implements AfterViewInit {
  @ContentChildren(NgxCarouselSLideDirective) slides!: QueryList<NgxCarouselSLideDirective>




  ngAfterViewInit() {
      const slidesList = this.slides.toArray().map((slide: any) => slide.el.nativeElement)
      console.log("🔸 slidesList:", slidesList)
  }
}
