import { Component, inject } from '@angular/core';
import { MEDIA_URL } from '../../../../core/urls';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { RegisterComponent } from '../../../../routes/register/register.component';
import { BtnIconComponent } from '../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register-popup',
  imports: [
    RegisterComponent,
    BtnIconComponent,
    TranslateModule,
    MatDialogModule,
  ],
  templateUrl: './register-popup.component.html',
  styleUrl: './register-popup.component.scss'
})
export class RegisterPopupComponent {
  heroImg = `${MEDIA_URL}heroes/alex`

  dialogRef = inject(MatDialogRef<RegisterPopupComponent>)
  private dialog = inject(MatDialog)

  goToLoginPopup() {
    this.dialogRef.close()
    this.dialog.open(LoginPopupComponent, {
      panelClass: ['login-dialog', 'green'],
      maxWidth: '700px',
      width: '100vw'
    })
  }
}
