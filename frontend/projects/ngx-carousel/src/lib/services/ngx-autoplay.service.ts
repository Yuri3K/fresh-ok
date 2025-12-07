import { effect, inject, Injectable, signal } from "@angular/core";
import { NgxCarouselService } from "./ngx-carousel.service";

@Injectable({
  providedIn: 'root'
})

export class NgxAutoplayService {
  private autoplayTimer: any = null
  private carousel = inject(NgxCarouselService)
  private config = signal(this.carousel.getConfig())
  private isPlaing = signal(true)

  constructor() {
    console.log("!!! AUTOPLAY RUN !!!")
    effect(() => {
      this.config().autoplay ?
        this.startAutoplay() :
        this.stopAutoplay()
    })
  }

  private startAutoplay() {
    if (!this.config().autoplay) return

    this.isPlaing.set(true)
    this.stopAutoplay()
    const interval = this.config().interval || 5000
    this.autoplayTimer = setInterval(() => this.carousel.next(), interval)
  }

  stopAutoplay() {
    this.isPlaing.set(false)

    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer)
      this.autoplayTimer = null
    }
  }

  resumeAutoplay() {
    if(this.config().autoplay) {
      setTimeout(() => {
        this.startAutoplay()
      }, 5000);
    }
  }
}