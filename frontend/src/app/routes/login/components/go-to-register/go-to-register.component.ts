import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-go-to-register',
  imports: [
    TranslateModule,
    RouterLink
  ],
  templateUrl: './go-to-register.component.html',
  styleUrl: './go-to-register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToRegisterComponent {
  isPopup = input(false)
  openRegisterPopup = output<void>()

  onRegisterClick(e: MouseEvent) {
    if(!this.isPopup()) return
    
    e.preventDefault();
    this.openRegisterPopup.emit()
  }
}
