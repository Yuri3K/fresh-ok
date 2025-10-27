import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { BtnFlatComponent } from '../btn-flat/btn-flat.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-google-btn',
  imports: [
    BtnFlatComponent,
    TranslateModule
  ],
  templateUrl: './google-btn.component.html',
  styleUrl: './google-btn.component.scss'
})
export class GoogleBtnComponent {
  private readonly authSetvice = inject(AuthService)
  private readonly router = inject(Router)

  async loginWithGoogle() {
    try {
      this.authSetvice.signInWithGoogle()
    } catch (err) {
      console.error('Login error wit Google account', err)
    }
  }
}
