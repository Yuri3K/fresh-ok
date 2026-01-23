import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestoreScrollService {
  private router = inject(Router)

  // Храним скролл для конкретных URL (ключ - путь, значение - скролл)
  private savedScroll = signal(0);
  private scrollContainer?: HTMLElement;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      // tap(() => console.log("PREV SCROLL", this.savedScroll())),
      takeUntilDestroyed()
    ).subscribe(() => {
      if (this.scrollContainer) {
        this.savedScroll.set(this.scrollContainer.scrollTop);
      }
      // tap(() => console.log("AFTER SCROLL", this.savedScroll()))
    });
  }

  // Метод для регистрации контейнера из компонента
  setContainer(el: HTMLElement) {
    this.scrollContainer = el;
  }

  restoreScroll() {
    const savedScroll = this.savedScroll();

    // Используем requestAnimationFrame, чтобы DOM успел отрендериться
    requestAnimationFrame(() => {
      this.scrollContainer?.scrollTo({ top: savedScroll, behavior: 'auto' });
    });
  }
}
