import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { LangRouterService } from '../../../../../core/services/lang-router.service';

@Component({
  selector: 'app-admin-btn',
  imports: [MiniFabBtnComponent],
  templateUrl: './admin-btn.component.html',
  styleUrl: './admin-btn.component.scss',
})
export class AdminBtnComponent {
  private navigateService = inject(LangRouterService)

  navigateToAdmin() {
    this.navigateService.navigate(
      ['/admin'],
      { queryParamsHandling: 'merge' }
    )
  }
}
