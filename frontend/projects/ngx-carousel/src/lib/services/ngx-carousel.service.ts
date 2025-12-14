import { computed, Inject, Injectable, Optional, signal } from '@angular/core';
import { DEFAULT_CAROUSEL_CONFIG, NGX_CAROUSEL_CONFIG, NgxCarouselConfig } from '../ngx-carousel.types';

@Injectable({
  providedIn: 'root'
})
export class NgxCarouselService {
  private config = signal<NgxCarouselConfig>(DEFAULT_CAROUSEL_CONFIG)
  private slides = signal<any[]>([])
  currentSlide = signal(0)

  // Флаг для отключения transition при мгновенном сбросе
  disableTransition = signal(false)

  slidesWithClones = computed<any[]>(() => {
    const data = this.slides();
    const length = data.length;

    if (length === 0) return [];

    // Если loop включен, добавляем клоны в начало и конец
    if (this.config().loop && length > 1) {
      return [
        data[length - 1], // Клон последнего в начало
        ...data,       // Все оригинальные
        data[0]        // Клон первого в конец
      ];
    }

    return data;
  });

  constructor(
    @Optional() @Inject(NGX_CAROUSEL_CONFIG) defaultCfg: NgxCarouselConfig
  ) {
    setTimeout(() => {
      
      console.log("🔸 defaultCfg:", defaultCfg)
    }, 1000);
    this.config.set({
      ...DEFAULT_CAROUSEL_CONFIG,
      ...(defaultCfg || {})
    })

    // // +1 потому что первый реальный слайд теперь имеет индекс 1
    // this.currentSlide.set((this.config().startIndex ?? 0) + 1)
  }


  register(slidesData: any[]) {
    this.slides.set(slidesData);

    // Установка стартового слайда с учетом клона
    const index = this.config().loop ?
      ((this.config().startIndex ?? 0) + 1) :
      (this.config().startIndex ?? 0)

    this.currentSlide.set(index)
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

  slidesLength(): number {
    return this.slides().length;
  }


  getDisplayIndex(): number {
    const len = this.slidesLength();
    if (len === 0) return 0;

    const current = this.currentSlide();

    // Если loop отключен, то просто вернем индекс текущего слайда
    if (!this.config().loop) return current

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

    if (this.config().loop) {
      // В режиме loop просто устанавливаем целевой индекс
      this.currentSlide.set(index + 1);
    } else {
      this.currentSlide.set(index);
    }
  }

  next() {
    const length = this.slidesLength();
    if (length <= 1) return

    this.disableTransition.set(false);
    const current = this.currentSlide();

    if (this.config().loop) {
      // Переходим к следующему (включая клон первого элемента)
      this.currentSlide.set(current + 1);

      // Если достигли клона первого элемента (индекс len + 1)
      if (current + 1 >= length + 1) {
        this.scheduleSnapToReal(1);
      }
    } else {
      // В режиме без loop просто проверяем границы
      if (current + 1 < length) {
        this.currentSlide.set(current + 1);
      }
    }
  }

  prev() {
    const length = this.slidesLength();
    if (length <= 1) return;

    this.disableTransition.set(false);
    const current = this.currentSlide();

    if (this.config().loop) {
      // Переходим к предыдущему (включая клон последнего элемента)
      this.currentSlide.set(current - 1);

      // Если достигли клона последнего элемента (индекс 0)
      if (current - 1 <= 0) {
        this.scheduleSnapToReal(length);
      }
    } else {
      // В режиме без loop просто проверяем границы
      if (current > 0) {
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
