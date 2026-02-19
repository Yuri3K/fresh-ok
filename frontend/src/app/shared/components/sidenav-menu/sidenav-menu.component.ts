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
import { toSignal } from '@angular/core/rxjs-interop';
import { UserAccessService } from '@core/services/user-access.service';
import { AuthService } from '@core/services/auth.service';
import { BtnRaisedComponent } from "@shared/ui-elems/buttons/btn-raised/btn-raised.component";
import { CartService } from '@core/services/cart.service';
import { FavsService } from '@core/services/favs.service';
import { Router } from '@angular/router';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';

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
    BtnRaisedComponent
],
  templateUrl: './sidenav-menu.component.html',
  styleUrl: './sidenav-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavMenuComponent {
  protected readonly sidebarService = inject(SidebarService)
  protected readonly signDialogService = inject(OpenSignDialogService)
  private userAccessService = inject(UserAccessService)
  private authService = inject(AuthService)
  protected totalItems = inject(CartService).totalItems
  protected totalFavs = inject(FavsService).totalFavs
  protected router = inject(Router)
  protected currentLang = inject(GetCurrentLangService).currentLang

  protected readonly user = toSignal(
    this.userAccessService.dbUser$,
    {initialValue: undefined}
  )

  protected logout() {
    this.authService.logout().subscribe()
  }

  protected navigateToProfile() {
    this.router.navigate([this.currentLang(), 'user'])
  }

protected navigateToFavs() {
  this.router.navigate([this.currentLang(), 'user', 'favs'])
}


}
