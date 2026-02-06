import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-control-textarea',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './form-control-textarea.component.html',
  styleUrl: './form-control-textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlTextareaComponent {
  textareaControl = input.required<FormControl>()
  label = input('')
  placeholder = input('')

  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
