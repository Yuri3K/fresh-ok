import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { H2TitleComponent } from "../../shared/ui-elems/typography/h2-title/h2-title.component";
import { TranslateModule } from '@ngx-translate/core';
import { BtnFlatComponent } from '../../shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GoToRegisterComponent } from './components/go-to-register/go-to-register.component';
import { LoginFormComponent } from "./components/login-form/login-form.component";

@Component({
  selector: 'app-login',
  imports: [
    H2TitleComponent,
    TranslateModule,
    BtnFlatComponent,
    ReactiveFormsModule,
    GoToRegisterComponent,
    LoginFormComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authSetvice = inject(AuthService)
  private readonly router = inject(Router)

  async loginWithGoogle() {
    try {
      this.authSetvice.signInWithGoogle()
      this.router.navigate(['/home'])
    } catch (err) {
      console.error('Login error wit Google account', err)
    }
  }
}
