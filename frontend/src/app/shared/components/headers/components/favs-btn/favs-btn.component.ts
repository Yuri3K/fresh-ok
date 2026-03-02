import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { LangRouterService } from '../../../../../core/services/langs/lang-router.service';
import { FavsService } from '@core/services/favs.service';

@Component({
  selector: 'app-favs-btn',
  imports: [
    MiniFabBtnComponent
  ],
  templateUrl: './favs-btn.component.html',
  styleUrl: './favs-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavsBtnComponent {
  private navigateService = inject(LangRouterService)
  protected readonly favsService = inject(FavsService)

  protected readonly favsCount = this.favsService.totalFavs

  navigateToFavs() {
    this.navigateService.navigate(['/user', 'favs'], {
      queryParamsHandling: 'merge'
    })
  }
}
