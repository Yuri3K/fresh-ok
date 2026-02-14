import { Component, computed, effect, input, output } from '@angular/core';
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
  size = input<'default' | 'big'>('default')
  quantity = input<number>(1)

  quantityChange = output<number>()

  btnWidth = computed(() => this.size() == 'default' ? '24px' : '44px')

  counter = new FormControl(this.quantity(), [Validators.min(1), Validators.max(999)]);

  constructor() {
    effect(() => {
      this.counter.setValue(this.quantity(), { emitEvent: false });
    });
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;

    // Перестраховка, чтобы получить целое число
    let val = parseInt(target.value, 10);

    if (val > 999) {
      val = 999;
    } else if (val < 1) {
      val = 1;
    }

    this.counter.setValue(val, { emitEvent: false });
  }

  increase() {
    const currentVal = this.counter.value || 1

    if (currentVal < 999) {
      const next = currentVal + 1
      this.counter.setValue(next)
      this.quantityChange.emit(next)
    }
  }

  decrease() {
    const currentVal = this.counter.value || 1

    if (currentVal > 1) {
      const prev = currentVal - 1
      this.counter.setValue(prev)
      this.quantityChange.emit(prev)
    }
  }
}
