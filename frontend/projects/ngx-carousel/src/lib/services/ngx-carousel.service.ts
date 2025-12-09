import { computed, effect, inject, Inject, Injectable, Optional, Renderer2, signal, TemplateRef } from '@angular/core';
import { NgxCarouselSlideComponent } from '../ngx-carousel-slide/ngx-carousel-slide.component';
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from '../ngx-carousel.types';

@Injectable({
  providedIn: 'root'
})
export class NgxCarouselService {
  private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG)
  private slidesData = signal<any[]>([]);
  templateRef = signal<TemplateRef<any> | null>(null);
  currentSlide = signal(0)

  private carouselListElement!: HTMLElement;
  private renderer!: Renderer2;

  slidesWithClones = computed<any[]>(() => {
    const data = this.slidesData();
    console.log("🔸 data:", data)
    const len = data.length;

    if (len === 0) return [];

    console.log("🔸", [
      data[len - 1], // Клон последнего в начало
      ...data,       // Все оригинальные
      data[0]        // Клон первого в конец
    ] )
    // Если loop включен, добавляем клоны в начало и конец
    if (this.config().loop && len > 1) {
      return [
        data[len - 1], // Клон последнего в начало
        ...data,       // Все оригинальные
        data[0]        // Клон первого в конец
      ];
    }

    return data;
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



  register(slidesData: any[], templateRef: TemplateRef<any>) {
    console.log("🔸 templateRef:", templateRef)
    this.slidesData.set(slidesData);
    this.templateRef.set(templateRef);

    // Установка стартового слайда с учетом клона
    this.currentSlide.set((this.config().startIndex ?? 0) + 1);
  }

  unregisterAll() {
    this.slidesData.set([])
  }

  setConfig(partial: Partial<NgxCarouselConfig>) {
    this.config.set({ ...this.config(), ...partial })
  }

  getConfig() {
    return this.config()
  }

  getSlides(){
    return this.slidesData()
  }

  slidesLength(): number {
    return this.slidesData().length
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

  registerCarouselList(element: HTMLElement, renderer: Renderer2) {
    this.carouselListElement = element;
    this.renderer = renderer;
  }

  private disableTransition() {
    if (this.renderer && this.carouselListElement) {
        this.renderer.setStyle(this.carouselListElement, 'transition', 'none');
    }
  }
  
  private enableTransition() {
    if (this.renderer && this.carouselListElement) {
        // Значение должно совпадать с ngx-carousel.component.scss
        this.renderer.setStyle(this.carouselListElement, 'transition', 'transform 0.5s ease');
    }
  }

  next() {
    const len = this.slidesLength()
    const slidesWithClonesCount = this.slidesWithClones().length;
    if (len === 0) return

    this.currentSlide.update(c => c + 1) // Анимированный сдвиг

    if (this.config().loop && this.currentSlide() >= slidesWithClonesCount - 1) { 
        // Достигнут последний клон (индекс len + 1), нужно сбросить на оригинал (индекс 1)
        
        const transitionDuration = 500; 

        setTimeout(() => {
          this.disableTransition()
          this.currentSlide.set(1) // Мгновенный сброс на первый оригинал
          setTimeout(() => this.enableTransition(), 50) 
        }, transitionDuration);
    }
  }

  prev() {
    const len = this.slidesLength()
    if (len === 0) return

    this.currentSlide.update(c => c - 1) // Анимированный сдвиг

    if (this.config().loop && this.currentSlide() <= 0) { 
        // Достигнут первый клон (индекс 0), нужно сбросить на оригинал (индекс len)

        const transitionDuration = 500; 

        setTimeout(() => {
          this.disableTransition()
          this.currentSlide.set(len) // Мгновенный сброс на последний оригинал
          setTimeout(() => this.enableTransition(), 50) 
        }, transitionDuration);
    }
  }
}
