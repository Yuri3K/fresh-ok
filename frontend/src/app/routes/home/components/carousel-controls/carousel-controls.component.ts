import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-carousel-controls',
  imports: [],
  templateUrl: './carousel-controls.component.html',
  styleUrl: './carousel-controls.component.scss'
})
export class CarouselControlsComponent {
  @Input() carousel!: any
  @Input() slides!: any

  isArrows = signal(true)
  isDots = signal(true)
}
