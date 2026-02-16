import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarService } from '@core/services/sidebar.service';
import { TranslateModule } from '@ngx-translate/core';
import { BtnIconComponent } from '@shared/ui-elems/buttons/btn-icon/btn-icon.component';
import { MainLogoComponent } from '../main-logo/main-logo.component';
import { MatIconModule } from '@angular/material/icon';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { OpenSignDialogService } from '@core/services/open-sign-dialog.service';

@Component({
  selector: 'app-sidenav-menu',
  imports: [
    BtnIconComponent,
    TranslateModule,
    MainLogoComponent,
    MatIconModule,
    BtnFlatComponent
],
  templateUrl: './sidenav-menu.component.html',
  styleUrl: './sidenav-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavMenuComponent {
  protected readonly sidebarService = inject(SidebarService)
  protected readonly signDialogService = inject(OpenSignDialogService)
}
