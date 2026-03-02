import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { TranslateModule } from '@ngx-translate/core';
import { MiniFabBtnComponent } from '@shared/ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';

@Component({
  selector: 'app-admin-btn',
  imports: [MiniFabBtnComponent, TranslateModule],
  templateUrl: './admin-btn.component.html',
  styleUrl: './admin-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBtnComponent {
  private navigateService = inject(LangRouterService)

  navigateToAdmin() {
    this.navigateService.navigate(['/admin'])
  }
}
