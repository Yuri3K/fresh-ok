import { computed, Inject, Injectable, Optional, signal } from '@angular/core';
import { NgxCarouselSlideComponent } from '../ngx-carousel-slide/ngx-carousel-slide.component';
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from '../ngx-carousel.types';

@Injectable({
  providedIn: 'root'
})
export class NgxCarouselService {
  private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG)
  private slides = signal<NgxCarouselSlideComponent[]>([])

  // Флаг для отключения transition при мгновенном сбросе
  private disableTransition = signal(false)
  currentSlide = signal(0)

  constructor(
    @Optional() @Inject(NGX_CAROUSEL_CONFIG) defaultCfg: NgxCarouselConfig
  ) {
    this.config.set({
      ...DEFAULT_CAROUSEL_CONFIG,
      ...(defaultCfg || {})
    })

    // +1 потому что первый реальный слайд теперь имеет индекс 1
    this.currentSlide.set((this.config().startIndex ?? 0) + 1)
  }

  slidesWithClones = computed(() => {
    const slides = this.slides();
    
    if (slides.length === 0) return [];
    
    // Если loop включен, добавляем клоны в начало и конец
    if (this.config().loop && slides.length > 1) {
      return [
        slides[slides.length - 1],   // Клон последнего в начало
        ...slides,                   // Все оригинальные
        slides[0]                    // Клон первого в конец
      ];
    }
    
    return slides;
  });

  register(slides: NgxCarouselSlideComponent[]) {
    this.slides.set(slides);
    // Устанавливаем начальную позицию с учетом клона
    this.currentSlide.set((this.config().startIndex ?? 0) + 1);
  }

  unregisterAll() {
    this.slides.set([]);
  }

  setConfig(partial: Partial<NgxCarouselConfig>) {
    this.config.set({ ...this.config(), ...partial })
  }

  getConfig() {
    return this.config()
  }

  getSlides(): NgxCarouselSlideComponent[] {
    return this.slides();
  }

  slidesLength(): number {
     return this.slides().length;
  }

  shouldDisableTransition(): boolean {
    return this.disableTransition();
  }

  /**
   * Получить индекс для отображения (без клонов, для индикаторов)
   */
  getDisplayIndex(): number {
    const len = this.slidesLength();
    if (len === 0) return 0;
    
    const current = this.currentSlide();
    
    // Если на клоне последнего (индекс 0), показываем последний реальный
    if (current === 0) return len - 1;
    
    // Если на клоне первого (индекс len + 1), показываем первый реальный
    if (current === len + 1) return 0;
    
    // Иначе вычитаем 1, так как реальные слайды начинаются с индекса 1
    return current - 1;
  }

  goTo(index: number) {
    const len = this.slidesLength();
    if (len === 0) return;

    // Конвертируем пользовательский индекс (0..n-1) в индекс с клонами (1..n)
    const targetIndex = index + 1;

    if (this.config().loop) {
      // В режиме loop просто устанавливаем целевой индекс
      // Логика клонов обрабатывается в handleInfiniteLoop
      this.currentSlide.set(targetIndex);
    } else {
      this.currentSlide.set(Math.max(1, Math.min(targetIndex, len)));
    }
  }

  next() {
    const len = this.slidesLength();
    if (len === 0) return;

    this.disableTransition.set(false);
    const current = this.currentSlide();

    if (this.config().loop) {
      // Переходим к следующему (включая клон первого элемента)
      this.currentSlide.set(current + 1);
      
      // Если достигли клона первого элемента (индекс len + 1)
      if (current + 1 === len + 1) {
        this.scheduleSnapToReal(1);
      }
    } else {
      // В режиме без loop просто проверяем границы
      if (current < len) {
        this.currentSlide.set(current + 1);
      }
    }
  }

  prev() {
    const len = this.slidesLength();
    if (len === 0) return;

    this.disableTransition.set(false);
    const current = this.currentSlide();

    if (this.config().loop) {
      // Переходим к предыдущему (включая клон последнего элемента)
      this.currentSlide.set(current - 1);
      
      // Если достигли клона последнего элемента (индекс 0)
      if (current - 1 === 0) {
        this.scheduleSnapToReal(len);
      }
    } else {
      // В режиме без loop просто проверяем границы
      if (current > 1) {
        this.currentSlide.set(current - 1);
      }
    }
  }

  /**
   * Планирует мгновенный переход к реальному слайду после завершения анимации
   */
  private scheduleSnapToReal(realIndex: number) {
    setTimeout(() => {
      this.disableTransition.set(true);
      this.currentSlide.set(realIndex);
      
      // Возвращаем transition через микротаск
      setTimeout(() => {
        this.disableTransition.set(false);
      }, 50);
    }, 500); // Должно совпадать с длительностью transition в CSS
  }
}
