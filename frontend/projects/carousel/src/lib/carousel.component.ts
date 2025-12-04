import { Component, computed, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { CarouselSlide } from './carousel.types';
import { RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'lib-carousel',
  imports: [
    RouterLink,
    NgStyle,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides!: CarouselSlide[];
  @Input() autoplay = true;
  @Input() carouselHeight = '500px';
  @Input() autoPlayInterval = 5000 // автопрокрутка каждые 5 сек
  @Input() restoreAutoPlayTime = 10000 // автопрокрутка каждые 5 сек

  currentIndex = signal(0)
  currentSlide = computed(() => this.slides[this.currentIndex()])

  private timerId: any
  private autoPlaySub?: Subscription

  ngOnInit() {
    if (this.autoplay && this.slides.length > 1) {
      this.startAutoPlay()
    }
  }

  private startAutoPlay() {
    // Cтарая подписка отменяется
    this.autoPlaySub?.unsubscribe()

    // Важно: Сбросить переменную, чтобы она была undefined, 
    // так как при unsubscribe() подписка все равно существует
    this.autoPlaySub = undefined;

    this.autoPlaySub = interval(this.autoPlayInterval).subscribe(() => this.next())
  }

  private stopAutoplay() {
    this.autoPlaySub?.unsubscribe()
  }

  // Останавливаем автопрокрутку при взаимодействии
  onUserInteraction() {
    if (this.autoplay) {
      // 1. Очищаем предыдущий setTimeout, если он существует и еще не сработал
      if (this.timerId) {
        clearTimeout(this.timerId)
      }

      // 2. Останавливаем текущую автопрокрутку (отписка от interval)
      this.stopAutoplay()

      // 3. Запускаем новый setTimeout и сохраняем его ID
      this.timerId = setTimeout(() => {
        this.startAutoPlay()
        this.timerId = null
      }, this.restoreAutoPlayTime);
    }
  }

  prev() {
    this.currentIndex.update(i => {
      return i == 0 ? this.slides.length - 1 : i - 1
    })
  }

  next() {
    this.currentIndex.update(i => {
      return (i + 1) % this.slides.length
    })
  }

  goToSlide(i: number) {
    this.currentIndex.set(i)
  }

  ngOnDestroy() {
    this.stopAutoplay()
    if(this.timerId) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
  }
}
