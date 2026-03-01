import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, Injector, input, OnInit, signal, Signal, viewChild, viewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { H6TitleComponent } from "@shared/ui-elems/typography/h6-title/h6-title.component";

export interface CustomSelector {
  title: string
  icon?: string
  ariaLabel?: string
  options: SelectorOption[]
}

export interface SelectorOption {
  slug: string
  iconName?: string,
  item: string
}
@Component({
  selector: 'app-custom-selector',
  imports: [
    MatButtonModule,
    MatIconModule,
    OpenMenuDirective,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    H6TitleComponent
],
  templateUrl: './custom-selector.component.html',
  styleUrl: './custom-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectorComponent implements OnInit {
  readonly customControl = input.required<FormControl>()
  readonly pathData = input.required<string>()

  private readonly translateService = inject(TranslateService)
  private injector = inject(Injector)

  openMenu = viewChild.required(OpenMenuDirective)
  optionButtons = viewChildren<ElementRef<HTMLButtonElement>>('optionBtn')
  triggerBtn = viewChild<ElementRef<HTMLButtonElement>>('triggerBtn')

  selectorData!: Signal<CustomSelector>

  // Хранит в себе объкт выбранного SelectorOption
  protected currentOption = signal<SelectorOption>({} as SelectorOption)

  constructor(){
    effect(() => {
      const value = this.customControl().value
      if(value) {
        this.setCurrentOption(value)
      }
    })
  }

  ngOnInit() {
    this.selectorData = toSignal(
      this.translateService.stream(this.pathData()),
      {
        initialValue: undefined,
        injector: this.injector
      }
    )
  }

  private setCurrentOption(slug: string) {
    const options = this.selectorData().options
    const target = options.find(o => o.slug == slug)
    target
      ? this.currentOption.set(target)
      : this.currentOption.set(options[0])
  }

  selectOption(slug: string) {
    this.setCurrentOption(slug)

    // emitEvent: true → гарантирует, что valueChanges у формы отработает.
    this.customControl().setValue(slug, { emitEvent: true }),

    // markAsDirty() → говорит Angular, что значение изменено пользователем.
    this.customControl().markAsDirty()

    // markAsTouched() → полезно для валидации (например, чтобы показать ошибки).
    this.customControl().markAsTouched()
  }

  handleTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      this.openMenu().open()
      this.focusCurrentOption()
    }

    if (event.key === 'Escape') {
      this.openMenu().close()
      this.triggerBtn()?.nativeElement.focus()
    }
  }

  handleListKeydown(event: KeyboardEvent) {
    const options = this.selectorData().options
    const currentIndex = options.findIndex(o => o.slug === this.currentOption().slug)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = (currentIndex + 1) % options.length
      // this.onOptionChanged.emit(options[nextIndex].slug)
      this.selectOption(options[nextIndex].slug)
      this.focusOption(nextIndex)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prevIndex = (currentIndex - 1 + options.length) % options.length
      // this.onOptionChanged.emit(options[prevIndex].slug)
      this.selectOption(options[prevIndex].slug)
      this.focusOption(prevIndex)
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.openMenu().close()
      this.triggerBtn()?.nativeElement.focus()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      this.openMenu().close()
      this.triggerBtn()?.nativeElement.focus()
    }
    if (event.key === 'Tab') { 
      event.preventDefault()
      this.openMenu()?.close() 
      this.triggerBtn()?.nativeElement.focus()
    }
  }

  private focusCurrentOption() {
    const options = this.selectorData().options
    const currentIndex = options.findIndex(o => o.slug === this.currentOption().slug)
    this.focusOption(currentIndex >= 0 ? currentIndex : 0)
  }

  private focusOption(index: number) {
    const btns = this.optionButtons()
    if (btns[index]) {
      btns[index].nativeElement.focus()
    }
  }

}







