import { computed, Inject, Injectable, Optional, Renderer2, signal, TemplateRef } from '@angular/core';
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from '../ngx-carousel.types';

@Injectable({
  providedIn: 'root'
})
export class NgxCarouselService {
  private carouselListElement!: HTMLElement;
  private renderer!: Renderer2;
  private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG)
  private slides = signal<any[]>([])
  templateRef = signal<TemplateRef<any> | null>(null);
  currentSlide = signal(0)

  // Флаг для отключения transition при мгновенном сбросе
  private disableTransition = signal(false)

  slidesWithClones = computed<any[]>(() => {
    const data = this.slides();
    const len = data.length;

    if (len === 0) return [];

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

    // +1 потому что первый реальный слайд теперь имеет индекс 1
    this.currentSlide.set((this.config().startIndex ?? 0) + 1)
  }

  registerCarouselList(element: HTMLElement, renderer: Renderer2) {
    this.carouselListElement = element;
    this.renderer = renderer;
  }

  register(slidesData: any[], templateRef: TemplateRef<any>) {
    this.slides.set(slidesData);
    this.templateRef.set(templateRef);

    // Установка стартового слайда с учетом клона
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

  getSlides() {
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
