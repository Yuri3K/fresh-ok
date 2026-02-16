import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, input, output, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { BtnIconComponent } from '@shared/ui-elems/buttons/btn-icon/btn-icon.component';

export interface MenuItem {
  text: string;
  icon?: string;
  action?: () => void;
  disabled?: boolean;
}

@Component({
  selector: 'app-menu',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    BtnIconComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  menuStateChange = output<{ isOpen: boolean; menuId?: string }>();
  menuTrigger = viewChild(MatMenuTrigger);

  showTooltip: boolean = false // Controls the visibility of the tooltip

  iconName = input('more_horiz')
  ariaLabel = input('') // Aria label for button menu
  btnDisabled = input(false) // Whether the button is disabled
  options = input.required<MenuItem[]>(); // options inside the menu button

  menuItemClicked(option: MenuItem) {
    if (option.action) {
      option.action()
    }
  }

  onMenuOpened(): void {
    this.menuStateChange.emit({ isOpen: true });
  }

  onMenuClosed(): void {
    this.menuStateChange.emit({ isOpen: false });
  }

  openMenu() {
    this.menuTrigger()?.openMenu();
  }

}
