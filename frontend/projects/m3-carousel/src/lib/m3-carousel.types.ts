import { InjectionToken } from "@angular/core"

export interface M3CarouselConfig {
  autoplay?: boolean,
  interval?: number,
  loop?: boolean,
  animation?: 'slide' | 'fade',
  startIndex?: number,
  breakpoints?: Record<number, { item: number }>
}

export const DEFAULT_CAROUSEL_CONFIG: M3CarouselConfig = {
  autoplay: true,
  interval: 5000,
  loop: true,
  animation: 'slide',
  startIndex: 0,
  breakpoints: {
    0: {item: 1},
    600: {item: 2},
    1024: {item: 3},
  }
}

export const M3_CAROUSEL_CONFIG = new InjectionToken<M3CarouselConfig>('M3_CAROUSEL_CONFIG')



