import { Component, Input, OnInit } from '@angular/core';
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
  
  ngOnInit() {
    console.log("🔸 slides:", this.slides)
    
  }
}
