import { ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, Injector, input, OnInit, output, signal, Signal, viewChild, viewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';

export interface CustomSelector {
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
    MatInputModule
  ],
  templateUrl: './custom-selector.component.html',
  styleUrl: './custom-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectorComponent implements OnInit {
  readonly currentOption = input.required()
  readonly pathData = input.required<string>()
  readonly onOptionChanged = output<string>()

  private readonly translateService = inject(TranslateService)
  private injector = inject(Injector)

  openMenu = viewChild.required(OpenMenuDirective)
  optionButtons = viewChildren<ElementRef<HTMLButtonElement>>('optionBtn')
  triggerBtn = viewChild<ElementRef<HTMLButtonElement>>('triggerBtn')

  selectorData!: Signal<CustomSelector>

  protected selectedOption = computed(() => {
    const options = this.selectorData().options
    const slug = this.currentOption()
    return options.find(o => o.slug == slug)?.item
  })

  ngOnInit() {
    this.selectorData = toSignal(
      this.translateService.stream(this.pathData()),
      {
        initialValue: undefined,
        injector: this.injector
      }
    )
  }

  selectOption(slug: string) {
    this.onOptionChanged.emit(slug)
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
    const currentIndex = options.findIndex(o => o.slug === this.currentOption())

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = (currentIndex + 1) % options.length
      this.onOptionChanged.emit(options[nextIndex].slug)
      this.focusOption(nextIndex)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prevIndex = (currentIndex - 1 + options.length) % options.length
      this.onOptionChanged.emit(options[prevIndex].slug)
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
    const currentIndex = options.findIndex(o => o.slug === this.currentOption())
    this.focusOption(currentIndex >= 0 ? currentIndex : 0)
  }

  private focusOption(index: number) {
    const btns = this.optionButtons()
    if (btns[index]) {
      btns[index].nativeElement.focus()
    }
  }

}







