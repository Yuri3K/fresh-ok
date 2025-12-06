import { Directive, ElementRef, inject, OnInit } from "@angular/core";

@Directive({
  selector: '[ngxCarouselSlide]',
  standalone: true
})

export class NgxCarouselSLideDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>)

  ngOnInit() {
    console.log("!!! EL !!!", this.el)
  }
}