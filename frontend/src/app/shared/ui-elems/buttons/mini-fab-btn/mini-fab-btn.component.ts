import { NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
})
export class MiniFabBtnComponent implements OnInit {
  @Input({ required: true }) iconName!: string;
  @Input() iconColor = "var(--mat-sys-on-secondary-container)";
  @Input() bgColor = "var(--mat-sys-primary-container)";
  @Input() count = 0;
  @Input() btnBorder = '2px solid transparent';
  @Input() borderRadius = '10px';
  @Input() isBadgeHidden = true;
  @Input() width: string = '40px';
  @Input() fz?: string;
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
