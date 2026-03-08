import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { TranslateModule } from '@ngx-translate/core';
import { Breadcrumb, BreadcrumbsService } from '@shared/components/breadcrumbs/breadcrumbs.service';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { BreadcrumbsComponent } from "@shared/components/breadcrumbs/breadcrumbs.component";
import { TodayComponent } from "@shared/components/admin/today/today.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    BtnFlatComponent,
    TranslateModule,
    BreadcrumbsComponent,
    TodayComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly navigateService = inject(LangRouterService)
  private readonly breadcrumbsService = inject(BreadcrumbsService)

  constructor() {
    effect(() => {
      const brcrs = this.breadcrumbsService.brcrTranslations()

      if (brcrs) {
        const breadcrumbs: Breadcrumb[] = [
          {
            label: brcrs.admin.name,
            url: brcrs.admin.url,
            icon: 'manage_accounts',
          },
          {
            label: brcrs.dashboard.name,
          },
        ]
        this.breadcrumbsService.setBreadcrumbs(breadcrumbs)
      }
    })
  }

  protected goToGoods() {
    this.navigateService.navigate(['/admin', 'goods'])
  }
}
