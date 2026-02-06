import { Component, inject } from '@angular/core';
import { MEDIA_URL } from '../../../../core/urls';
import { BtnIconComponent } from '../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { LoginComponent } from '../../../../routes/login/login.component';
import { MatDialogRef, MatDialog} from '@angular/material/dialog';
import { RegisterPopupComponent } from '../register-popup/register-popup.component';
// import { UserAccessService } from '../../../../core/services/user-access.service';

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
  heroImg = `${MEDIA_URL}heroes/donna`

  private dialogRef = inject(MatDialogRef<LoginPopupComponent>)
  private dialog = inject(MatDialog)

  goToRegisterPopup() {
    this.dialogRef.close()
    this.dialog.open(RegisterPopupComponent, {
      panelClass: 'register-dialog',
      maxWidth: '700px',
      width: '100vw'
    })
  }
}
