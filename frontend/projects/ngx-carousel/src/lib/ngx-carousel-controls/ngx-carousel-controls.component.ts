import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxCarouselService } from '../ngx-carousel.service';

@Component({
  selector: 'ngx-carousel-controls',
  imports: [
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './ngx-carousel-controls.component.html',
  styleUrl: './ngx-carousel-controls.component.scss'
})
export class NgxCarouselControlsComponent {
  carousel = inject(NgxCarouselService)
}
