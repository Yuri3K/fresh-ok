import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appShowEl]',
})
export class ShowElDirective implements OnInit {
  @HostBinding('class.show') isShow = false;

  private elemBody!: HTMLElement | null;
  private elemContent!: HTMLElement | null;
  private elemToggle!: HTMLElement | null;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const host = this.elRef.nativeElement;
    this.elemBody = host.querySelector('.elem-body');
    console.log('🚀 ~ elemBody:', this.elemBody);
    this.elemContent = host.querySelector('.elem-content');
    console.log('🚀 ~ elemContent:', this.elemContent);
    this.elemToggle = host.querySelector('.elem-toggle');

    if (!this.elemBody || !this.elemContent) {
      console.warn(
        "Directive 'appShowEl' can not find elemBody with class 'show'"
      );
    }
  }

  private showEl() {
    if (!this.elemBody || !this.elemContent) return;

    const height = this.elemContent.getBoundingClientRect().height;
    this.renderer.setStyle(this.elemBody, 'max-height', height + 'px');
    this.isShow = true;
  }

  private hideEl() {
    if (!this.elemBody || !this.elemContent) return;

    this.renderer.setStyle(this.elemBody, 'max-height', '0px');
    this.isShow = false;
  }

  private toggle() {
    this.isShow ? this.hideEl() : this.showEl();
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
