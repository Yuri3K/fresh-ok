import { computed, effect, Inject, Injectable, signal } from '@angular/core';
import { DEFAULT_CAROUSEL_CONFIG, M3_CAROUSEL_CONFIG, M3CarouselConfig } from './m3-carousel.types';

@Injectable({
  providedIn: 'root'
})
export class M3CarouselService {
  private config = signal<M3CarouselConfig>(DEFAULT_CAROUSEL_CONFIG)
  private autoplayTimer: any = null
  private _slides = signal<any[]>([])
  readonly slides = computed(() => this._slides())

  currentIndex = signal(0)
  isPlaing = signal(false)

  constructor(
    @Inject(M3_CAROUSEL_CONFIG) defaultCfg: M3CarouselConfig
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

  setConfig(partial: Partial<M3CarouselConfig>) {
    this.config.set({ ...this.config(), ...partial })
  }

  getConfig() {
    return this.config()
  }

  unregisterAll() {
    this._slides.set([])
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
