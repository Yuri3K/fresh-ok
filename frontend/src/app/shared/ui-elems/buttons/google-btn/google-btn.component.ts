import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
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
  styleUrl: './google-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleBtnComponent {
  isPopup = input(false)
  submitWithGoogleEmited = output<void>()
  
  private readonly authSetvice = inject(AuthService)

  async loginWithGoogle() {
    this.authSetvice.signInWithGoogle().subscribe()

    if(this.isPopup()) {
      this.submitWithGoogleEmited.emit()
    }
  }
}
