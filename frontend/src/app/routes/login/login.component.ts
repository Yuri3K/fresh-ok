import { Component, input, output } from '@angular/core';
import { H2TitleComponent } from "../../shared/ui-elems/typography/h2-title/h2-title.component";
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoToRegisterComponent } from './components/go-to-register/go-to-register.component';
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { GoogleBtnComponent } from '../../shared/ui-elems/buttons/google-btn/google-btn.component';

@Component({
  selector: 'app-login',
  imports: [
    H2TitleComponent,
    TranslateModule,
    ReactiveFormsModule,
    GoToRegisterComponent,
    LoginFormComponent,
    GoogleBtnComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isPopup = input(false)
  openRegisterPopup = output<void>()

  switchToRegisterPopup() {
    this.openRegisterPopup.emit()
  }
}
