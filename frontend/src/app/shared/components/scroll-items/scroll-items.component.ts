import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  Renderer2,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-scroll-items',
  imports: [NgTemplateOutlet],
  templateUrl: './scroll-items.component.html',
  styleUrl: './scroll-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollItemsComponent<T> {
  // Порог в пикселях для различения клика и скролла
  dragThreshold = input<number>(5);
  itemsGap = input<string>('0');
  itemsMaxWidth = input<string>('750px');
  itemTemplate = contentChild.required<TemplateRef<any>>('itemTemplate');
  scrollItemsData = input.required<T[]>();

  scrollItemsList = viewChild<ElementRef<HTMLDivElement>>('scrollItemsList');

  private renderer = inject(Renderer2);
  private scrollItemsBox!: HTMLDivElement | undefined;

  isDragging = signal(false);
  private isScrollEnough = signal(false);

  private startX = 0;
  private currentX = 0;
  scrollStart = 0;

  constructor() {
    effect(() => {
      this.scrollItemsBox = this.scrollItemsList()?.nativeElement;
    });
  }

  @HostListener('document:mouseup')
  documentClick() {
    this.isDragging.set(false);
    this.renderer.removeClass(this.scrollItemsBox, 'dragging');
    this.renderer.removeClass(document.body, 'no-select');
  }

  // Обработка случаев, когда pointer покидает область или отменяется
  @HostListener('document:pointercancel', ['$event'])
  onPointerCancel(event: PointerEvent) {
    this.onPointerUp(event);
  }

  onPointerDown(event: PointerEvent) {
    if (this.scrollItemsBox) {
      this.startX = event.clientX;
      this.scrollStart = this.scrollItemsBox.scrollLeft;
      this.currentX = 0;

      this.isDragging.set(true);
      this.isScrollEnough.set(false);

      // this.renderer.setStyle(this.scrollItemsBox, 'scroll-behavior', 'auto')
    }
  }

  onPointerMove(event: PointerEvent) {
    this.currentX = event.clientX - this.startX;

    if(!this.isDragging()) return

    if (Math.abs(this.currentX) > this.dragThreshold()) {
      this.isDragging.set(true);
      this.isScrollEnough.set(true);
    }

    if (this.isScrollEnough() && this.scrollItemsBox) {
      this.scrollItemsBox.setPointerCapture(event.pointerId);
      this.renderer.addClass(this.scrollItemsBox, 'dragging');
      this.renderer.addClass(document.body, 'no-select');

      this.scrollItemsBox.scrollLeft = this.scrollStart - this.currentX;
    }
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isDragging()) return;

    if (this.scrollItemsBox) {
      // Освобождаем pointer capture
      if (this.scrollItemsBox.hasPointerCapture(event.pointerId)) {
        this.scrollItemsBox.releasePointerCapture(event.pointerId);
      }

      // // Возвращаем плавную прокрутку
      // this.renderer.setStyle(this.scrollItemsBox, 'scroll-behavior', 'smooth');

      // Убираем классы
      this.renderer.removeClass(this.scrollItemsBox, 'dragging');
      this.renderer.removeClass(document.body, 'no-select');

      // Сбрасываем состояние
      this.isDragging.set(false);
      this.isScrollEnough.set(false);
      this.currentX = 0;
    }
  }
}
