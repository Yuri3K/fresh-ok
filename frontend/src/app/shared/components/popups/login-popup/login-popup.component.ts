import { Component } from '@angular/core';
import { MEDIA_URL } from '../../../../core/urls';
import { BtnIconComponent } from '../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { LoginFormComponent } from '../../../../routes/login/components/login-form/login-form.component';

@Component({
  selector: 'app-login-popup',
  imports: [
    BtnIconComponent,
    LoginFormComponent
  ],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss'
})
export class LoginPopupComponent {
  heroImg = `${MEDIA_URL}heroes/alex`
}
