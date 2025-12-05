import { Directive, TemplateRef } from "@angular/core";
import { M3CarouselService } from "./m3-carousel.service";

@Directive({
  selector: '[M3CarouselSlide]',
  standalone: true
})

export class M3CarouselSlideDirective {
  constructor(public tpl: TemplateRef<any>, private carousel: M3CarouselService) { }

  ngOnInit() {
    this.carousel.register(this.tpl);
  }

  ngOnDestroy() {
    // если нужно — можно реализовать unregister
    this.carousel.unregisterAll();
  }
}