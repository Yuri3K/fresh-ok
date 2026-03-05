import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { H6TitleComponent } from '@shared/ui-elems/typography/h6-title/h6-title.component';

@Component({
  selector: 'app-form-control-input-number',
  imports: [
    TranslateModule,
    H6TitleComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './form-control-input-number.component.html',
  styleUrls: ['./form-control-input-number.component.scss', '../form-control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlInputNumberComponent {
  readonly inputControl = input.required<FormControl>()
  readonly title = input<string>('')
  readonly label = input<string>()
  readonly placeholder = input<string>('')
  readonly hint = input<string>()
  readonly suffixIcon = input<string>()
  readonly maxNum = input<number | null>(null)
  readonly errorMessage = input<string>('')

  protected checkOrder(event: Event) {
    if(!this.maxNum()) return

    const order = +(event.target as HTMLInputElement).value

    let checkedOrder = order

    if (!order) checkedOrder = 1

    if (+order < 1) checkedOrder = 1
    if (+order > this.maxNum()!) checkedOrder = this.maxNum()!

    this.inputControl().setValue(checkedOrder)
  }
}
