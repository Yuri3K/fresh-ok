import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appShowEl]',
})
export class ShowElDirective implements OnInit {
  @HostBinding('class.show') elemName = '';

  private elemBodies!: HTMLElement[] | null;
  private elemContent!: HTMLElement | null;

  @Input()
  set appShowEl(value: string) {
    this.elemName = value;

    queueMicrotask(() => {
      value ? this.showEl() : this.hideEl();
    });
  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const host = this.elRef.nativeElement;
    this.elemBodies = Array.from(host.querySelectorAll('.elem-body'));
    this.elemContent = host.querySelector('.elem-content');

    if (!this.elemBodies || !this.elemContent) {
      console.warn(
        "Directive 'appShowEl' can not find elemBody with class 'show'"
      );
    }
  }

  private showEl() {
    if (!this.elemBodies?.length || !this.elemContent) return;
    const elemBody = this.elemBodies.find(b => b.classList.contains(this.elemName))

    this.hideEl() // закрываем все открытые панели перед открытием выбранной

    if (elemBody) {
      const height = this.elemContent.getBoundingClientRect().height;
      this.renderer.setStyle(elemBody, 'max-height', height + 'px');
      this.renderer.setStyle(elemBody, 'overflow', 'unset');
    }
  }

  private hideEl() {
    if (!this.elemBodies || !this.elemContent) return;

    this.elemBodies.forEach(b => {
      if (b) {
        this.renderer.setStyle(b, 'max-height', '0px');
        this.renderer.setStyle(b, 'overflow', 'hidden');
      }

    })

    this.elemName = ''
  }

  private toggle() {
    this.elemName ? this.hideEl() : this.showEl();
  }

  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent) {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    if (target.closest('.elem-toggle')) {
      this.toggle();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onEscape(event: KeyboardEvent) {
    if (event.code === 'Escape') this.hideEl();
  }
}
