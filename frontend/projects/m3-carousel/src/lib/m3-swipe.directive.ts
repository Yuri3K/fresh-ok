import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({
  selector: '[m3Swipe]',
  standalone: true,
})

export class M3SwipeDirective {
  @Output() swipeLeft = new EventEmitter<void>()
  @Output() swipeRight = new EventEmitter<void>()

  private startX = 0
  private sensitivity = 30 // чувствительность, px

  @HostListener('pointerdown', ['$event'])
  onDown(e: PointerEvent) {
    const target = e.target as HTMLElement
    this.startX = e.clientX;
    target.setPointerCapture(e.pointerId)
  }

  @HostListener('pointerup', ['$event'])
  onUp(e: PointerEvent) {
    const delta = e.clientX - this.startX

    if (Math.abs(delta) > this.sensitivity) {
      delta < 0
        ? this.swipeLeft.emit()
        : this.swipeRight.emit()
    }
  }

  @HostListener('pointercancel', ['$event'])
  onCancel(e: PointerEvent) {
    console.log("!!! POINTER CANCEL !!!")
  }

  
}