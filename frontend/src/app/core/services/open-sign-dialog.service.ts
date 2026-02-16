import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopupComponent } from '@shared/components/dialogs/login-popup/login-popup.component';
import { RegisterPopupComponent } from '@shared/components/dialogs/register-popup/register-popup.component';

@Injectable({
  providedIn: 'root'
})
export class OpenSignDialogService {
  private readonly dialog = inject(MatDialog)

  openLoginDialog() {
    this.dialog.open(LoginPopupComponent, {
      panelClass: ['login-dialog', 'green'],
      maxWidth: '700px',
      width: '100vw',
    });
  }

  openRegisterDialog() {
    this.dialog.open(RegisterPopupComponent, {
      panelClass: ['register-dialog', 'green'],
      maxWidth: '700px',
      width: '100vw',
    });
  }
}
