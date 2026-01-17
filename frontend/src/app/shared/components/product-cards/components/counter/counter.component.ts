import { Component } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';

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

    // Перестраховка, чтобы получить целое число
    let val = parseInt(target.value, 10); 

    if (val > 999) {
      val = 999;
    } else if (val < 1) {
      val = 1;
    }

    this.counter.setValue(val.toString(), { emitEvent: false });
  }

  increase() {
    const currentVal = (parseInt(this.counter.value || '1', 10))

    if(currentVal < 999) {
      this.counter.setValue((currentVal + 1).toString())
    }
  }

  decrease() {
    const currentVal = parseInt(this.counter.value || '1', 10)

    if(currentVal > 1) {
      this.counter.setValue((currentVal - 1).toString())
    }
  }
}
