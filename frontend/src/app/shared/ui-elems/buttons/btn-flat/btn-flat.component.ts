import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-btn-flat',
  imports: [
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    NgStyle
  ],
  templateUrl: './btn-flat.component.html',
  styleUrl: './btn-flat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnFlatComponent {
  @Input({ required: true }) btnText!: string
  @Input() btnHeight = '40px' 
  @Input() btnWidth = 'auto' 
  @Input() iconName?: string
  @Input() iconColor = 'var(--mat-sys-on-primary)'
  @Input() tooltipText?: string
  @Input() ariaLabel?: string;
  @Input() fzIcon?: string;
  @Input() fzText = '1rem';
  @Input() btnDisabled = false;
  @Input() type: string = 'button';
  @Input() borderRarius!: string;
  @Input() btnBorder = 'none';
  @Input() textColor: string = 'var(--mat-sys-on-background)';
  @Input() bgColor: string = 'var(--mat-sys-primary-container)';

  @HostListener('click', ['$event']) 
  handleClick(e: Event) {
    if (this.btnDisabled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}