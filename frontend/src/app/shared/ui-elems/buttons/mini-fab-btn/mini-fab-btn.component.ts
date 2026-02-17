import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
export class MiniFabBtnComponent {
  iconName = input<string>('');
  btnText = input<string | number>('');
  iconColor = input<string>("var(--mat-sys-on-secondary-container)");
  bgColor = input<string>("var(--mat-sys-primary-container)");
  count = input<number>(0);
  btnBorder = input<string>('2px solid transparent');
  btnPadding = input<string>('');
  borderRadius = input<string>('10px');
  isBadgeHidden = input<boolean>(true);
  width = input<string>('40px');
  height = input<string>('');
  fz = input<string>('');
  fzText = input<string>('1rem');
  ariaLabel = input<string>('');
  btnDisabled = input<boolean>();
  tooltipShowDelay = input<number>(150);
  tooltipText = input<string>('');
  badgePosition = input<MatBadgePosition>('before');

  calcFz = computed(() => {
    if (!this.fz()) {
      return `${Math.round(parseInt(this.width()) * 0.6) / 16}rem`;
    } else return this.fz()
  })

}
