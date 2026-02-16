import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatBadgeModule, MatBadgePosition } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-mini-fab-btn',
  imports: [
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    NgStyle,
    MatTooltip,
  ],
  templateUrl: './mini-fab-btn.component.html',
  styleUrl: './mini-fab-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniFabBtnComponent implements OnInit {
  @Input() iconName!: string;
  @Input() btnText!: string | number;
  @Input() iconColor = "var(--mat-sys-on-secondary-container)";
  @Input() bgColor = "var(--mat-sys-primary-container)";
  @Input() count = 0;
  @Input() btnBorder = '2px solid transparent';
  @Input() btnPadding?: string;
  @Input() borderRadius = '10px';
  @Input() isBadgeHidden = true;
  @Input() width: string = '40px';
  @Input() height?: string;
  @Input() fz?: string;
  @Input() fzText?: string = '1rem';
  @Input() ariaLabel: string = '';
  @Input() btnDisabled = false;
  @Input() tooltipShowDelay = 150;
  @Input() tooltipText?: string;
  @Input() badgePosition: MatBadgePosition = 'before';

  ngOnInit() {
    if (!this.fz) {
      this.fz = `${Math.round(parseInt(this.width) * 0.6) / 16}rem`;
    }
  }
}
