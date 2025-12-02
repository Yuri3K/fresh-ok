import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-carousel',
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit {
  @Input() slides!: any[];
  
  ngOnInit() {
    console.log("🔸 slides:", this.slides)
    
  }
}
