import { Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: '[M3CarouselSlide]',
  standalone: true
})

export class M3CarouselSlideDirective {
  constructor(public tpl: TemplateRef<any>){}
}