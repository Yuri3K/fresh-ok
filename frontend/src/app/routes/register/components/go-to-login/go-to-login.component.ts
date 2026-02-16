import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-go-to-login',
  imports: [
    TranslateModule,
    RouterLink
  ],
  templateUrl: './go-to-login.component.html',
  styleUrl: './go-to-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToLoginComponent {
  isPopup = input(false)
  openLoginPopup = output<void>()
  
  onLoginClick(e: MouseEvent) {
    if(!this.isPopup()) return

    e.preventDefault();
    this.openLoginPopup.emit()
  }
}
