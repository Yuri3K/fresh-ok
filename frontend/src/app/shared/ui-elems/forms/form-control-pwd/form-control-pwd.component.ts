import { Component, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-control-pwd',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    TranslateModule,
    MatTooltipModule,
  ],
  templateUrl: './form-control-pwd.component.html',
  styleUrls: ['./form-control-pwd.component.scss', '../form-control.scss']
})
export class FormControlPasswordComponent {
  @Input({required: true}) pwdControl!: FormControl
  @Input() label?: string
  @Input() hint?: string

  isPwdHide = signal(true);

  togglePwdVisibility(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isPwdHide.set(!this.isPwdHide())
  }
}

