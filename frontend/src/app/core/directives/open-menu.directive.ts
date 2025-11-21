import { Directive, ElementRef, HostBinding, HostListener, OnInit, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appOpenMenu]"
})
export class OpenMenuDirective implements OnInit {
  @HostBinding("class.open") isOpen = false;

  private dropdownBody!: HTMLElement | null;
  private dropdownList!: HTMLElement | null;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Ищем элементы один раз, а не при каждом клике
    const host = this.elRef.nativeElement;
    this.dropdownBody = host.querySelector(".dropdown-body");
    this.dropdownList = host.querySelector(".dropdown-list");

    // Подстраховка — если структура HTML сломана
    if (!this.dropdownBody || !this.dropdownList) {
      console.warn("appOpenMenu: .dropdown-body or .dropdown-list mot found");
    }
  }

  // ---------------------------------------
  // Методы управления меню
  // ---------------------------------------

  private open() {
    if (!this.dropdownBody || !this.dropdownList) return;

    const height = this.dropdownList.getBoundingClientRect().height;
    this.renderer.setStyle(this.dropdownBody, "max-height", height + "px");
    this.isOpen = true;
  }

  private close() {
    if (!this.dropdownBody) return;

    this.renderer.setStyle(this.dropdownBody, "max-height", "0px");
    this.isOpen = false;
  }

  private toggle() {
    this.isOpen ? this.close() : this.open();
  }

  // ---------------------------------------
  // Обработчики событий
  // ---------------------------------------

  @HostListener("click", ["$event"])
  onHostClick(event: MouseEvent) {
    event.stopPropagation(); // предотвращаем двойные срабатывания
    this.toggle();
  }

  @HostListener("document:click")
  onDocumentClick() {
    this.close();
  }

  @HostListener("document:keydown", ["$event"])
  onEscape(event: KeyboardEvent) {
    if (event.code === "Escape") this.close();
  }
}