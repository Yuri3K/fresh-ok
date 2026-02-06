import { Component, inject } from '@angular/core';
import { MEDIA_URL } from '../../../../core/urls';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { RegisterComponent } from '../../../../routes/register/register.component';
import { BtnIconComponent } from '../../../ui-elems/buttons/btn-icon/btn-icon.component';

@Component({
  selector: 'app-register-popup',
  imports: [
    RegisterComponent,
    BtnIconComponent
  ],
  templateUrl: './register-popup.component.html',
  styleUrl: './register-popup.component.scss'
})
export class RegisterPopupComponent {
  heroImg = `${MEDIA_URL}heroes/alex`

  private dialogRef = inject(MatDialogRef<RegisterPopupComponent>)
  private dialog = inject(MatDialog)

  goToLoginPopup() {
    this.dialogRef.close()
    this.dialog.open(LoginPopupComponent, {
      panelClass: 'login-dialog',
      maxWidth: '700px',
      width: '100vw'
    })
  }
}
