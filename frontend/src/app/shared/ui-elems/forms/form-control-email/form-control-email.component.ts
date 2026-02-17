import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-control-email',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './form-control-email.component.html',
  styleUrls: ['./form-control-email.component.scss', '../form-control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlEmailComponent {
  emailControl = input.required<FormControl>()
  label = input<string>('')
  placeholder = input<string>('')
  hint = input<string>('')
}
