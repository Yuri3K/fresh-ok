import { Component, computed, ElementRef, HostListener, inject, Input, OnDestroy, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CarouselSlide } from './carousel.types';
import { NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-carousel',
  imports: [
    NgStyle,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides!: CarouselSlide[];
  @Input() autoplay = false;
  @Input() carouselHeight = '500px';
  @Input() autoPlayInterval = 5000 // автопрокрутка каждые 5 сек
  @Input() restoreAutoPlayTime = 10000 // автопрокрутка каждые 5 сек
  @Input() swipeEnabled = true // Включить/выключить свайпы
  @Input() swipeMinDistance = 50 // Минимальное расстояние для свайпа (в пикселях)
  @Input() draggingEnabled = true
  @Input() dragMinDistance = 50

  private readonly renderer = inject(Renderer2)
  private readonly router = inject(Router)

  @ViewChild('carouselList') carouselList!: ElementRef<HTMLElement>

  currentIndex = signal(0)
  currentSlide = computed(() => this.slides[this.currentIndex()])

  // Для обработки touch событий
  private touchStartX = 0
  private touchEndX = 0
  private touchStartY = 0
  private touchEndY = 0
  private isSwiping = false

  // Для обработки mouse событий
  private mouseStartX = 0
  private mouseEndX = 0
  private mouseStartY = 0
  private mouseEndY = 0
  isDragging = false

  private timerId: any
  private autoPlaySub?: Subscription

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key == 'ArrowLeft') {
      this.prev()
      this.onUserInteraction()
    } else if (event.key == 'ArrowRight') {
      this.next()
      this.onUserInteraction()
    }
  }

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

  // ============ TOUCH EVENTS (Mobile) ============
  onTouchStart(event: TouchEvent) {
    if (!this.swipeEnabled) return

    this.touchStartX = event.changedTouches[0].screenX
    this.touchStartY = event.changedTouches[0].screenY

    this.isSwiping = true
  }

  onTouchMove(event: TouchEvent) {
    if (!this.swipeEnabled || !this.isSwiping) return
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.swipeEnabled || !this.isSwiping) return

    this.touchEndX = event.changedTouches[0].screenX
    this.touchEndY = event.changedTouches[0].screenY
    this.handleSwipe()
    this.isSwiping = false
  }

  handleSwipe() {
    const deltaX = this.touchStartX - this.touchEndX
    const deltaY = this.touchStartY - this.touchEndY

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < -this.swipeMinDistance) {
        this.prev()
      } else if (deltaX > this.swipeMinDistance) {
        this.next()
      }
      this.onUserInteraction()
    }
  }
  // ============ END TOUCH EVENTS (Mobile) ============


  // ============ MOUSE EVENTS (Desktop) ============
  onMouseDown(event: MouseEvent) {
    if (!this.draggingEnabled) return

    this.mouseStartX = event.screenX
    this.mouseStartY = event.screenY
    this.isDragging = true

    event.preventDefault()
  }

  onMouseMove(event: MouseEvent) {
    if (!this.draggingEnabled || !this.isDragging) return
  }

  onMouseUp(event: MouseEvent) {
    if (!this.draggingEnabled || !this.isDragging) return
    this.mouseEndX = event.screenX
    this.mouseEndY = event.screenY
    this.handleDragging()
    this.isDragging = false
  }

  onMouseLeave(event: MouseEvent) {
    if (!this.isDragging) return

    this.isDragging = false
  }

  private handleDragging() {
    const deltaX = this.mouseStartX - this.mouseEndX
    const deltaY = this.mouseStartY - this.mouseEndY
    
    if ((Math.abs(deltaX) > Math.abs(deltaY))) {
      if (deltaX < -this.dragMinDistance) {
        this.prev()
      } else if (deltaX > this.dragMinDistance) {
        this.next()
      }
      this.onUserInteraction()
    }
  }

  navigateByLink(link: string) {
    const deltaX = this.mouseStartX - this.mouseEndX
    const deltaY = this.mouseStartY - this.mouseEndY

    if (
      (Math.abs(deltaX) < this.dragMinDistance)
      && (Math.abs(deltaY) < this.dragMinDistance)
    ) {
      this.router.navigate([link], {
        queryParamsHandling: 'merge'
      }).then()
    }

  }

  ngOnDestroy() {
    this.stopAutoplay()
    if (this.timerId) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
    this.isDragging = false
    this.isSwiping = false
  }
}
