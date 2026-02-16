import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SwitchModeComponent } from './components/switch-mode/switch-mode.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { LangDropdownComponent } from '../../ui-elems/selectors/lang-dropdown/lang-dropdown.component';
import { BtnIconComponent } from '../../ui-elems/buttons/btn-icon/btn-icon.component';
import { AdminBtnComponent } from './components/admin-btn/admin-btn.component';
import { SidebarService } from '@core/services/sidebar.service';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SwitchModeComponent,
    UserAvatarComponent,
    LangDropdownComponent,
    BtnIconComponent,
    AdminBtnComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly sidebarService = inject(SidebarService)
}
