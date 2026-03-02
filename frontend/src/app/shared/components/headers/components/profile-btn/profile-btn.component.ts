import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { LangRouterService } from '../../../../../core/services/langs/lang-router.service';

@Component({
  selector: 'app-profile-btn',
  imports: [MiniFabBtnComponent],
  templateUrl: './profile-btn.component.html',
  styleUrl: './profile-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileBtnComponent {
  private navigateService = inject(LangRouterService);

  navigateToProfile() {
    this.navigateService.navigate(['/user'], {
      queryParamsHandling: 'merge',
    });
  }
}
