import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, input, Input } from '@angular/core';
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
  btnHeight = input<string>('40px')
  btnWidth = input<string>('100%')
  iconName = input<string>();
  iconColor = input<string>('var(--mat-sys-on-background)');
  tooltipText = input<string>();
  ariaLabel = input<string>();
  btnDisabled = input<boolean>(false);
  type = input<string>('button');
  borderRarius = input<string>();
  textColor = input<string>('var(--mat-sys-on-background)');
  fzIcon = input<string>();
  fzText = input<string>('1rem');

  @HostListener('click', ['$event'])
  handleClick(e: Event) {
    if (this.btnDisabled()) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
