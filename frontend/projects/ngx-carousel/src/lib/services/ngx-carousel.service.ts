import { computed, effect, inject, Inject, Injectable, Optional, signal, TemplateRef } from '@angular/core';
import { NgxCarouselSlideComponent } from '../ngx-carousel-slide/ngx-carousel-slide.component';
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from '../ngx-carousel.types';

@Injectable({
  providedIn: 'root'
})
export class NgxCarouselService {
  private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG)
  private slides = signal<TemplateRef<unknown>[]>([]);
  currentSlide = signal(0)

  slidesWithClones = computed(() => {
    const slides = this.slides();

    if (slides.length === 0) return [];

    // Если loop включен, добавляем клоны в начало и конец
    if (this.config().loop && slides.length > 1) {
      return [
        // slides[slides.length - 1], // Клон последнего в начало
        ...slides,                  // Все оригинальные
        // slides[0]                   // Клон первого в конец
      ];
    }

    return slides;
  });

  constructor(
    @Optional() @Inject(NGX_CAROUSEL_CONFIG) defaultCfg: NgxCarouselConfig
  ) {
    this.config.set({
      ...DEFAULT_CAROUSEL_CONFIG,
      ...(defaultCfg || {})
    })
    this.currentSlide.set((this.config().startIndex ?? 0) + 1)
  }



  register(slides: NgxCarouselSlideComponent[]) {
    // Извлекаем templateRef из каждого компонента
    const templateRefs = slides.map(slide => slide.templateRef);
    this.slides.set(templateRefs);
  }

  unregisterAll() {
    this.slides.set([])
  }

  setConfig(partial: Partial<NgxCarouselConfig>) {
    this.config.set({ ...this.config(), ...partial })
  }

  getConfig() {
    return this.config()
  }

  getSlides(){
    return this.slides()
  }

  slidesLength(): number {
    return this.slides().length
  }

  goTo(index: number) {
    const len = this.slidesLength()

    if (len == 0) return

    if (this.config().loop) {
      const normalized = ((index % len) + len) % len
      this.currentSlide.set(normalized)
    } else {
      this.currentSlide.set(Math.max(0, Math.min(index, len - 1)))
    }
  }

  next() {
    this.goTo(this.currentSlide() + 1)
  }

  prev() {
    this.goTo(this.currentSlide() - 1)
  }
}
