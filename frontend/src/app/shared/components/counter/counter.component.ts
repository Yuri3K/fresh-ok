import { Component } from '@angular/core';
import { MiniFabBtnComponent } from '../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-counter',
  imports: [
    MiniFabBtnComponent,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatFormField,
    ReactiveFormsModule,
  ],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
})
export class CounterComponent {
  counter = new FormControl('1', [Validators.min(1), Validators.max(999)]);

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let val = parseInt(target.value, 10); // перестраховка, чтобы получить целое число

    if (val > 999) {
      val = 999;
    } else if (val < 1) {
      val = 1;
    }

    this.counter.setValue(val.toString(), { emitEvent: false });
  }
}
