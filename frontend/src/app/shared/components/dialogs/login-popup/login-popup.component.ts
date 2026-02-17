import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MEDIA_URL } from '../../../../core/urls';
import { BtnIconComponent } from '../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { LoginComponent } from '../../../../routes/login/login.component';
import { MatDialogRef, MatDialog, MatDialogModule} from '@angular/material/dialog';
import { RegisterPopupComponent } from '../register-popup/register-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { OpenSignDialogService } from '@core/services/open-sign-dialog.service';

@Component({
  selector: 'app-login-popup',
  imports: [
    BtnIconComponent,
    LoginComponent,
    TranslateModule,
    MatDialogModule,
  ],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPopupComponent {
  heroImg = `${MEDIA_URL}heroes/donna`

  protected dialogRef = inject(MatDialogRef<LoginPopupComponent>)
  private signDialogService = inject(OpenSignDialogService)

  goToRegisterPopup() {
    this.dialogRef.close()
    this.signDialogService.openRegisterDialog()
  }
}
