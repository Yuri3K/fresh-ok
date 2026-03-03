import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { TranslateModule } from '@ngx-translate/core';
import { MiniFabBtnComponent } from '@shared/ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';

@Component({
  selector: 'app-custom-user-btn',
  imports: [MiniFabBtnComponent, TranslateModule],
  templateUrl: './custom-user-btn.component.html',
  styleUrl: './custom-user-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomUserBtnComponent {
    private navigateService = inject(LangRouterService)

  navigateToHomepage() {
    this.navigateService.navigate(['/home'])
  }
}
