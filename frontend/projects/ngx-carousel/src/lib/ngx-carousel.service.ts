import { computed, effect, inject, Inject, Injectable, Optional, signal } from '@angular/core';
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from './ngx-carousel.types';

@Injectable({
  providedIn: 'root'
})
export class NgxCarouselService {
  private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG)
  private autoplayTimer: any = null
  private _slides = signal<any[]>([])
  readonly slides = computed(() => this._slides())

  currentIndex = signal(0)
  isPlaing = signal(false)

  constructor(
    @Optional() @Inject(NGX_CAROUSEL_CONFIG) defaultCfg: NgxCarouselConfig
  ) {
    this.config.set({
      ...DEFAULT_CAROUSEL_CONFIG,
      ...(defaultCfg || {})
    })
    this.currentIndex.set(this.config().startIndex ?? 0)

    effect(() => {
      this.config().autoplay
        ? this.startAutoplay()
        : this.stopAutoplay()
    })
  }

  register(slide: any) {
    this._slides.update(slides => [...slides, slide])
  }

  unregisterAll() {
    this._slides.set([])
  }

  setConfig(partial: Partial<NgxCarouselConfig>) {
    this.config.set({ ...this.config(), ...partial })
  }

  getConfig() {
    return this.config()
  }

  slidesLength(): number {
    return this._slides().length
  }

  goTo(index: number) {
    const len = this.slidesLength()

    if (len == 0) return

    if (this.config().loop) {
      const normalized = ((index % len) + len) % len
      this.currentIndex.set(normalized)
    } else {
      this.currentIndex.set(Math.max(0, Math.min(index, len - 1)))
    }
  }

  next() {
    this.goTo(this.currentIndex() + 1)
  }

  prev() {
    this.goTo(this.currentIndex() - 1)
  }

  startAutoplay() {
    if (!this.config().autoplay) return

    this.isPlaing.set(true)
    this.stopAutoplay()
    const interval = this.config().interval ?? 5000
    this.autoplayTimer = setInterval(() => this.next(), interval)
  }

  stopAutoplay() {
    this.isPlaing.set(false)

    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer)
      this.autoplayTimer = null
    }
  }

  puaseTemporarily() {
    // pause during user interaction
    this.stopAutoplay()
  }

  resumeAfterInteraction() {
    if (this.config().autoplay) this.startAutoplay()
  }
}
