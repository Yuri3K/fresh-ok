import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { LangRouterService } from '../../../../../core/services/lang-router.service';

@Component({
  selector: 'app-favs-btn',
  imports: [
    MiniFabBtnComponent
  ],
  templateUrl: './favs-btn.component.html',
  styleUrl: './favs-btn.component.scss'
})
export class FavsBtnComponent {
  private navigateService = inject(LangRouterService)

  navigateToFavs() {
    this.navigateService.navigate(['/user', 'favs'], {
      queryParamsHandling: 'merge'
    })
  }
}
