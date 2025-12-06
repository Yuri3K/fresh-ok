import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-carousel-slide',
  imports: [],
  templateUrl: './ngx-carousel-slide.component.html',
  styleUrl: './ngx-carousel-slide.component.scss'
})
export class NgxCarouselSlideComponent {
  @ViewChild(TemplateRef) public templateRef!: TemplateRef<any>;

}
