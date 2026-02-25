import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { H6TitleComponent } from '@shared/ui-elems/typography/h6-title/h6-title.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-form-control-phone',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective,
    H6TitleComponent,
    MatIconModule
  ],
  templateUrl: './form-control-phone.component.html',
  styleUrls: ['./form-control-phone.component.scss', '../form-control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgxMask()],
})
export class FormControlPhoneComponent {
  inputControl = input.required<FormControl<string>>()
  title = input('')

  private inputRef = viewChild.required<ElementRef<HTMLInputElement>>('inputRef')

  /** Stores the last pressed key to determine cursor behavior */
  lastKey: string | null = null;

  onKeyDown(event: KeyboardEvent) {
    this.lastKey = event.key;
  }

  onInput() {
    const inputEl = this.inputRef().nativeElement;
    const value = inputEl.value;

    // Оставляем только цифры
    const digits = value.replace(/\D/g, '');

    // digits.length === 5 → курсор перескакивает за закрывающую скобку.
    // digits.length === 8 → курсор перескакивает за первый дефис.
    // digits.length === 10 → курсор перескакивает за второй дефис.
    if (/\d/.test(this.lastKey ?? '')) {
      // После ввода кода оператора (3 цифры после +38)
      if (digits.length === 5) {
        // +38(XXX|
        setTimeout(() => inputEl.setSelectionRange(8, 8));
      }
      // После ввода первых трёх цифр номера
      if (digits.length === 8) {
        // +38(XXX)YYY-|
        setTimeout(() => inputEl.setSelectionRange(12, 12));
      }
      // После ввода двух цифр блока
      if (digits.length === 10) {
        // +38(XXX)YYY-ZZ-|
        setTimeout(() => inputEl.setSelectionRange(15, 15));
      }
    }

    this.lastKey = null;
  }



}
