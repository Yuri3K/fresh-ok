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
  ) { }

  ngOnInit() {
    // Ищем элементы один раз, а не при каждом клике
    const host = this.elRef.nativeElement;
    this.dropdownBody = host.querySelector(".dropdown-body");
    this.dropdownList = host.querySelector(".dropdown-list");

    // Подстраховка — если структура HTML сломана
    if (!this.dropdownBody || !this.dropdownList) {
      console.warn("appOpenMenu: .dropdown-body or .dropdown-list not found");
    }
  }

  // ---------------------------------------
  // Методы управления меню
  // ---------------------------------------

  open() {
    console.log("OPEN CALLED")
    if (!this.dropdownBody || !this.dropdownList) return;

    // Получаем размеры и позицию
    const listRect = this.dropdownList.getBoundingClientRect();
    const bodyRect = this.dropdownBody.getBoundingClientRect();

    // Вычисляем доступное пространство снизу от dropdown-body
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - bodyRect.bottom;

    // Отступ от края окна (можно настроить)
    const bottomGap = 16;
    const maxAvailableHeight = spaceBelow - bottomGap;

    // Выбираем меньшее значение: либо высота списка, либо доступное пространство
    const finalHeight = Math.min(listRect.height, maxAvailableHeight);

    this.renderer.setStyle(this.dropdownBody, "max-height", finalHeight + "px");
    this.renderer.setStyle(this.dropdownBody, "overflow-y", "auto");
    this.isOpen = true;
  }

  close() {
    console.log("CLOSE CALLED")
    if (!this.dropdownBody) return;

    this.renderer.setStyle(this.dropdownBody, "max-height", "0px");
    this.renderer.setStyle(this.dropdownBody, "overflow-y", "hidden");
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