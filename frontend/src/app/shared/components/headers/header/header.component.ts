import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LangDropdownComponent } from '../../../ui-elems/selectors/lang-dropdown/lang-dropdown.component';
import { BtnIconComponent } from '../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { SidebarService } from '@core/services/sidebar.service';
import { TranslateModule } from '@ngx-translate/core';
import { AdminBtnComponent } from '../components/admin-btn/admin-btn.component';
import { UserAvatarComponent } from '../components/user-avatar/user-avatar.component';
import { SwitchModeComponent } from '../components/switch-mode/switch-mode.component';
import { CustomUserBtnComponent } from "../components/custom-user-btn/custom-user-btn.component";

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
    TranslateModule,
    CustomUserBtnComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly layoutType = input<'menu' | 'admin'>('menu')
  protected readonly sidebarService = inject(SidebarService)

  protected readonly tooltipText = computed(() => {
    return this.sidebarService.activeSidenav() === this.layoutType()
      ? 'header.close-menu'
      : 'header.open-menu'
  })
}
