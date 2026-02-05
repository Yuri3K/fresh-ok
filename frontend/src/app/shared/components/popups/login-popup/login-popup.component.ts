import { Component, inject } from '@angular/core';
import { MEDIA_URL } from '../../../../core/urls';
import { BtnIconComponent } from '../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { LoginComponent } from '../../../../routes/login/login.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserAccessService } from '../../../../core/services/user-access.service';

@Component({
  selector: 'app-login-popup',
  imports: [
    BtnIconComponent,
    LoginComponent
  ],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss'
})
export class LoginPopupComponent {
  private userAccessService = inject(UserAccessService)

  heroImg = `${MEDIA_URL}heroes/donna`

  user = toSignal(
    this.userAccessService.dbUser$,
    {initialValue: null}
  )
}
