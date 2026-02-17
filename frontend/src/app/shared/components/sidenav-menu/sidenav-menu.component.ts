import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarService } from '@core/services/sidebar.service';
import { TranslateModule } from '@ngx-translate/core';
import { BtnIconComponent } from '@shared/ui-elems/buttons/btn-icon/btn-icon.component';
import { MainLogoComponent } from '../main-logo/main-logo.component';
import { MatIconModule } from '@angular/material/icon';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { OpenSignDialogService } from '@core/services/open-sign-dialog.service';
import { CatalogSelectorComponent } from '@shared/ui-elems/selectors/catalog-selector/catalog-selector.component';
import { LocationComponent } from '../location/location.component';
import { MatDividerModule } from '@angular/material/divider';
import { FooterNavComponent } from '../public-footer/components/footer-nav/footer-nav.component';

@Component({
  selector: 'app-sidenav-menu',
  imports: [
    BtnIconComponent,
    TranslateModule,
    MainLogoComponent,
    MatIconModule,
    BtnFlatComponent,
    CatalogSelectorComponent,
    LocationComponent,
    MatDividerModule,
    FooterNavComponent,
  ],
  templateUrl: './sidenav-menu.component.html',
  styleUrl: './sidenav-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavMenuComponent {
  protected readonly sidebarService = inject(SidebarService)
  protected readonly signDialogService = inject(OpenSignDialogService)
}
