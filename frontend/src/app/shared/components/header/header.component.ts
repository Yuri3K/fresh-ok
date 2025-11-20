import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SwitchModeComponent } from './components/switch-mode/switch-mode.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { LangDropdownComponent } from '../../ui-elems/selectors/lang-dropdown/lang-dropdown.component';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SwitchModeComponent,
    UserAvatarComponent,
    LangDropdownComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
}
