import { NgStyle } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-btn-icon',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, NgStyle],
  templateUrl: './btn-icon.component.html',
  styleUrl: './btn-icon.component.scss',
})
export class BtnIconComponent {
  @Input() iconName: string = '';
  @Input() iconColor?: string;
  @Input() tooltipText?: string;
  @Input() tooltipShowDelay = 150;
  @Input() btnDisabled = false;
  @Input() ariaLabel: string = '';
  @Input() fz?: string;
  @Input() width: string = '40px';
  @Input() type: string = 'button';

  @HostBinding('class.disabled') get isDisabled() {
    return this.btnDisabled;
  }

  ngOnInit() {
    console.log('🚀 ~ iconColor:', this.iconColor);
    if (!this.fz) {
      this.fz = `${Math.round(parseInt(this.width) * 0.6) / 16}rem`;
    }
  }
}
