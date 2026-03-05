import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-form-control-checkbox',
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
  ],
  templateUrl: './form-control-checkbox.component.html',
  styleUrl: './form-control-checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FormControlCheckboxComponent {
  readonly checkboxControl = input.required<FormControl<boolean>>()
  readonly label = input.required<string>()
  readonly checkboxDisabled = input<boolean>(false)

   update(event: MatCheckboxChange) {
    this.checkboxControl().setValue(event.checked)
  }
}
