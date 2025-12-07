import { ElementRef, inject, Injectable, Renderer2, signal } from '@angular/core';
import { NgxCarouselService } from './ngx-carousel.service';
import { NgxAutoplayService } from './ngx-autoplay.service';

@Injectable({
  providedIn: 'root'
})
export class NgxSwipeService {
  private carousel = inject(NgxCarouselService);
  private autoplay = inject(NgxAutoplayService);

  private renderer!: Renderer2
  private startX = 0;
  private currentX = 0;
  private isSwiping = signal(false);
  private carouselList!: ElementRef<HTMLDivElement>;

  registerSlideList(element: ElementRef<HTMLDivElement>) {
    this.carouselList = element
  }

  setRenderer(renderer: Renderer2) {
    this.renderer = renderer;
  }

  onPointerDown(event: PointerEvent) {
    this.startX = event.clientX;
    this.isSwiping.set(true);
    this.autoplay.stop();
    this.carouselList.nativeElement.setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isSwiping()) return;
    this.currentX = event.clientX - this.startX;
    const offset = -(this.carousel.currentSlide() * 100) + (this.currentX / this.carouselList.nativeElement.clientWidth) * 100;
    this.renderer.setStyle(this.carouselList.nativeElement, 'transition', 'none');
    this.renderer.setStyle(this.carouselList.nativeElement, 'transform', `translateX(${offset}%)`);
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isSwiping()) return;
    this.isSwiping.set(false)

    this.renderer
      .setStyle(this.carouselList.nativeElement, 'transition', 'transform 0.5s ease')

    const swipeDistance = this.currentX
    const threshold = this.carouselList.nativeElement.clientWidth * 0.25;

    if (swipeDistance < -threshold) {
      this.carousel.next();
    } else if (swipeDistance > threshold) {
      this.carousel.prev();
    } else {
      this.snapBack();
    }

    this.currentX = 0;
    this.autoplay.resume(); 
  }

  private snapBack() {
    this.renderer
      .setStyle(this.carouselList.nativeElement, 'transform', `translateX(-${this.carousel.currentSlide() * 100}%)`)
  }

}
