import { Component, inject, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { filter, map } from 'rxjs';
import { AvatarPopupComponent } from './components/avatar-popup/avatar-popup.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { UserAccessService } from '../../../../../core/services/user-access.service';
import { MEDIA_URL } from '../../../../../core/urls';

@Component({
  selector: 'app-user-avatar',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AsyncPipe,
    TranslateModule,
    AvatarPopupComponent,
    OverlayModule
  ],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class UserAvatarComponent {
  private readonly authService = inject(AuthService)
  readonly dbUser$ = inject(UserAccessService).dbUser$
  
  readonly authUser$ = this.authService.user$
  readonly tooltipContent$ = this.authUser$
  .pipe(
    filter(user => user !== undefined),
    map(user =>
      ['Google Account', user?.displayName ?? '', user?.email ?? ''].join('\n')
    )
  )
  
  readonly mediaUrl = MEDIA_URL
  readonly avatarMeta = 'f_auto,q_auto,c_thumb,g_face,r_max,w_32,h_32/'

  isPopupOpen = false

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen
  }

  closePopup() {
    this.isPopupOpen = false
  }

  logout() {
    this.authService.logout().subscribe()
  }
}
