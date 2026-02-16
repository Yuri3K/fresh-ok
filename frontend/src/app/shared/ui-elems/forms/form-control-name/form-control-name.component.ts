import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-control-name',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './form-control-name.component.html',
  styleUrls: ['./form-control-name.component.scss', '../form-control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlNameComponent {
  @Input({ required: true }) nameControl!: FormControl
  @Input() label?: string
  @Input() placeholder = ''
  @Input() hint?: string
  @Input() suffixIcon = ''
}
