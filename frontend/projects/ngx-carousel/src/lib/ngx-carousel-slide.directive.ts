import { Directive, ElementRef, inject, OnInit, TemplateRef } from "@angular/core";

@Directive({
  selector: '[ngxCarouselSlide]',
  standalone: true
})

export class NgxCarouselSLideDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>)

  // constructor(public tpl: TemplateRef<any>) { }

  ngOnInit() {
    console.log("!!! EL !!!", this.el)
  }
}