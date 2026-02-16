import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { H2TitleComponent } from '../../shared/ui-elems/typography/h2-title/h2-title.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { GoToLoginComponent } from './components/go-to-login/go-to-login.component';
import { GoogleBtnComponent } from '../../shared/ui-elems/buttons/google-btn/google-btn.component';

@Component({
  selector: 'app-register',
  imports: [
    TranslateModule,
    H2TitleComponent,
    RegisterFormComponent,
    GoToLoginComponent,
    GoogleBtnComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  isPopup = input(false)
  closePopup = output<void>()

  openLoginPopup = output<void>()

  switchToLoginPopup() {
    this.openLoginPopup.emit()
  }

  
  closeRegisterPopup() {
    this.closePopup.emit()
  }
}
