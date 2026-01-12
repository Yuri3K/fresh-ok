import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, DestroyRef, ElementRef, EventEmitter, HostListener, inject, input, Output, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-scroll-items',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './scroll-items.component.html',
  styleUrl: './scroll-items.component.scss'
})
export class ScrollItemsComponent<T> implements AfterViewInit {
  @Output() scrolledItemClicked = new EventEmitter<T>()
  
  scrollItemsData = input.required<T[]>()

  @ViewChild('scrollItemsList', { static: true }) 
  scrollItemsList!: ElementRef<HTMLDivElement>;

  @ContentChild('itemTemplate', { static: true })
  itemTemplate!: TemplateRef<any>

  private destroyRef = inject(DestroyRef)
  private scrolledItemsBox!: HTMLElement
  private isDragging = false

  @HostListener('document:mouseup')
  documentClick() {
    this.isDragging = false
    this.scrolledItemsBox.classList.remove('dragging')
    document.body.classList.remove('no-select');
  }

  ngAfterViewInit() {
    this.initglobalFilesBoxDragging()
    this.initCanDragging()
  }

  /**
 * Initializes the drag-to-scroll behavior for the file container.
 */
  private initglobalFilesBoxDragging() {
    this.scrolledItemsBox = this.scrollItemsList.nativeElement
    fromEvent<MouseEvent>(this.scrolledItemsBox, 'mousemove')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e: MouseEvent) => {
        if (!this.isDragging) return
        this.scrolledItemsBox.classList.add('dragging')
        this.scrolledItemsBox.scrollLeft -= e.movementX
        document.body.classList.add('no-select');
      })
  }

  /**
   * Initializes mouse down event to enable drag mode.
   */
  private initCanDragging() {
    fromEvent(this.scrolledItemsBox, 'mousedown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isDragging = true)
  }
}
