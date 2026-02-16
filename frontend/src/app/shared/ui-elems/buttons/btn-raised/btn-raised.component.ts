import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  @Input({ required: true }) btnText!: string
  @Input() iconName?: string
  @Input() iconColor = 'var(--mat-sys-on-primary)'
  @Input() tooltipText?: string
  @Input() ariaLabel?: string;
  @Input() fz?: string;
  @Input() btnDisabled = false;
  @Input() type: string = 'button';

}
