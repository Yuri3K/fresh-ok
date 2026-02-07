import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
  checkboxControl = input.required<FormControl<boolean>>()
  label = input.required<string>()
}
