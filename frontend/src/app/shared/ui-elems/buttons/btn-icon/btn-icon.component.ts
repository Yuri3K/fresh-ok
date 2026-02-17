import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-btn-icon',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, NgStyle],
  templateUrl: './btn-icon.component.html',
  styleUrl: './btn-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnIconComponent {
  iconName = input<string>('');
  iconColor = input<string>('');
  tooltipText = input<string>('');
  tooltipShowDelay = input<number>(150);
  btnDisabled = input<boolean>(false);
  ariaLabel = input<string>('');
  fz = input<string>('');
  width = input<string>('40px');
  type = input<string>('button');

  @HostBinding('class.disabled') get isDisabled() {
    return this.btnDisabled();
  }

  calcFz = computed(() => {
    if (!this.fz()) {
      return `${Math.round(parseInt(this.width()) * 0.6) / 16}rem`;
    } else return this.fz()
  })
}
