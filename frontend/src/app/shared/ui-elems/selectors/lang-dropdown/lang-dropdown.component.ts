import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { LangsService } from '../../../../core/services/langs.service';

@Component({
  selector: 'app-lang-dropdown',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    TranslateModule
  ],
  templateUrl: './lang-dropdown.component.html',
  styleUrl: './lang-dropdown.component.scss'
})
export class LangDropdownComponent {
  @Input() control!: AbstractControl;

  @Output() selectionChange = new EventEmitter<any>();

  private langs$ = inject(LangsService).langs$

  get hasValidators(): boolean {
    return !!this.control?.validator || !!this.control?.asyncValidator;
  }

  selectionChangeEvent(event: any) {
    this.selectionChange.emit(event.value);
  }
}
