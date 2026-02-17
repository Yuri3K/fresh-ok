import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-btn-raised',
  imports: [
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    NgStyle
  ],
  templateUrl: './btn-raised.component.html',
  styleUrl: './btn-raised.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnRaisedComponent {
  btnText = input.required<string>()
  iconName = input<string>(); 
  iconColor = input<string>('var(--mat-sys-on-primary)');
  tooltipText = input<string>();
  ariaLabel = input<string>();
  fz = input<string>();
  btnDisabled = input<boolean>(false);
  type = input<string>('button');
}
