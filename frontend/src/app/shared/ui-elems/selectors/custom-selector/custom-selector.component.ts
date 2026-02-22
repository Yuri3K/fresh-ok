import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, input, Signal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';

export interface CustomSelector {
  icon?: string
  ariaLabel?: string
  name: string
  options: SelectorOption[]
}

export interface SelectorOption {
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
export class CustomSelectorComponent {
  readonly pathData = input.required<string>()

  private readonly translateService = inject(TranslateService)
  private injector = inject(Injector)

  // protected readonly selectorData = signal<CustomSelector>({} as CustomSelector)

  selectorData!: Signal<CustomSelector>
  // protected translations = toSignal(
  //   this.translateService.stream(this.pathData()),
  //   {initialValue: undefined}
  // )

 

  ngOnInit() {
    this.selectorData = toSignal(
      this.translateService.stream(this.pathData()),
      { 
        initialValue: undefined,
        injector: this.injector
       }
    )
    console.log("🔸 this.translations:", this.selectorData())
  }

  selectOption(value: string) {
    // this.formControl()?.setValue(value)
  }
}
