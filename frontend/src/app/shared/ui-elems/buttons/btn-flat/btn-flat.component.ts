import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, input } from '@angular/core';
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
  btnText = input.required<string>()
  btnHeight = input<string>('40px') 
  btnWidth = input<string>('auto') 
  iconName = input<string>('')
  iconColor = input<string>('var(--mat-sys-on-primary)')
  tooltipText = input<string>('')
  ariaLabel = input<string>('');
  fzIcon = input<string>('');
  fzText = input<string>('1rem');
  alignContent = input('center')
  btnDisabled = input<boolean>(false);
  type = input<string>('button');
  borderRarius = input<string>('');
  btnBorder = input<string>('none');
  textColor = input<string>('var(--mat-sys-on-background)');
  bgColor = input<string>('var(--mat-sys-primary-container)');

  @HostListener('click', ['$event']) 
  handleClick(e: Event) {
    if (this.btnDisabled()) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}