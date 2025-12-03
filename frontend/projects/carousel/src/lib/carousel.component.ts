import { Component, Input, OnInit, signal } from '@angular/core';
import { CarouselSlide } from './carousel.types';
import { RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'lib-carousel',
  imports: [RouterLink, NgStyle],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit {
  @Input() slides!: CarouselSlide[];
  @Input() autoplay = true;
  @Input() autoPlayInterval = 5000 // автопрокрутка каждые 5 сек

  currentIndex = signal(0)
  
  ngOnInit() {
    console.log("🔸 slides:", this.slides)
  }

  prev() {

  }

  next() {

  }
}
