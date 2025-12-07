import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { NgxCarouselService } from "./ngx-carousel.service";
import { config } from "rxjs/internal/config";

@Injectable({
  providedIn: 'root'
})

export class NgxAutoplayService {
  private timerAutoplay: any = null
  // private timerResume: any = null
  private carousel = inject(NgxCarouselService)
  private isPlaying = signal(true)
  private config = computed(() => this.carousel.getConfig());

  constructor() {
    effect(() => {
      if(!this.config().autoplay || this.carousel.slidesLength() <= 1) {
        this.stop()
        return
      }

      this.config().autoplay ?
        this.start() :
        this.stop()
    })
  }

  private start() {
    if (!this.config().autoplay || !this.isPlaying()) return
    
    this.stop()
    const delay  = this.config().interval ?? 5000
    this.timerAutoplay = setInterval(() => this.carousel.next(), delay )
  }

  stop() {
    this.isPlaying.set(false)
    if (this.timerAutoplay) {
      clearInterval(this.timerAutoplay)
      this.timerAutoplay = null
    }
  }

  pause() {
    if(this.config().pauseOnHover) {
      this.stop();
    }
  }

  resume() {
    if(this.config().autoplay) {
      this.isPlaying.set(true);

      const delay = this.config().interval ?? 5000;
      setTimeout(() => this.start(), delay);
    }
  }
}