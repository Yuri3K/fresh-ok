import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, viewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatHint } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { BtnFlatComponent } from "@shared/ui-elems/buttons/btn-flat/btn-flat.component";
import { MatInputModule } from '@angular/material/input';
import { maxDateValidator } from '@core/validators/max-date.validator';
import { H3TitleComponent } from "@shared/ui-elems/typography/h3-title/h3-title.component";
import { BtnIconComponent } from "@shared/ui-elems/buttons/btn-icon/btn-icon.component";

@Component({
  selector: 'app-edit-date-dialog',
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
    MatHint,
    BtnFlatComponent,
    NgxMaskDirective,
    MatInputModule,
    H3TitleComponent,
    BtnIconComponent
],
  templateUrl: './edit-date-dialog.component.html',
  styleUrl: './edit-date-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [provideNgxMask()],
})

export class EditDateDialogComponent implements AfterViewInit {
  protected dialogRef = inject(MatDialogRef<EditDateDialogComponent>)

  private inputRef = viewChild.required<ElementRef<HTMLInputElement>>('inputRef')

  protected inputControl = new FormControl('', [Validators.required, maxDateValidator()])

  /** Stores the last pressed key to determine cursor behavior */
  lastKey: string | null = null;

  /** Focuses and sets the cursor position in the input after view initialization. */
  ngAfterViewInit() {
    setTimeout(() => {
      const input = this.inputRef().nativeElement;
      input.focus();
      input.setSelectionRange(0, 0);
    }, 200); // задержка нужна, потому что для диалога установлена
    // анимация открытиея 150ms. Делаем еще 50ms запас
  }

  /**
   * Stores the last key pressed in the input field.
   * @param event Keyboard event
   */
  onKeyDown(event: KeyboardEvent) {
    this.lastKey = event.key;
  }

  /** Adjusts cursor position as digits are entered to match masked format. */
  onInput() {
    const inputEl = this.inputRef().nativeElement;
    const value = inputEl.value;

    const digits = value.replace(/\D/g, '');

    if (/\d/.test(this.lastKey ?? '')) {
      if (digits.length === 2) {
        setTimeout(() => inputEl.setSelectionRange(5, 5));
      }
      if (digits.length === 4) {
        setTimeout(() => inputEl.setSelectionRange(10, 10));
      }
    }

    this.lastKey = null;
  }

  /**  Closes the dialog and returns the parsed Date if input is valid. */
  applyDate() {
    if (this.inputControl.valid && this.inputControl.value) {
      const [mm, dd, yy] = this.inputControl.value.split(' / ');
      const date = new Date(Number('20' + yy), Number(mm) - 1, Number(dd));
      this.dialogRef.close(date)
    }
  }
}
