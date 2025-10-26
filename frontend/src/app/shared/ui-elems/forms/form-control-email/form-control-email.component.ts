import { Component, Input } from '@angular/core';
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
  styleUrls: ['./form-control-email.component.scss', '../form-control.scss']
})
export class FormControlEmailComponent {
  @Input({ required: true }) emailControl!: FormControl
  @Input() label?: string
  @Input() placeholder = ''
  @Input() hint?: string
  @Input() errorEmailRequired?: string
  @Input() errorEmailInvalid?: string
}
