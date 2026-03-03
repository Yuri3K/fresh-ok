import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { TranslateModule } from '@ngx-translate/core';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    BtnFlatComponent,
    TranslateModule,

  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly navigateService = inject(LangRouterService)

  goToGoods() {
    this.navigateService.navigate(['/admin', 'goods'])
  }
}
