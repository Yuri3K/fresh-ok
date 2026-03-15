import { ChangeDetectionStrategy, Component,  effect,  inject, input, OnDestroy } from '@angular/core';
import { BreadcrumbsComponent } from "@shared/components/breadcrumbs/breadcrumbs.component";
import { AdminProductCardComponent } from "@shared/components/product-cards/admin-product-card/admin-product-card.component";
import { AdminCategoryStateService } from '@core/services/admin/admin-category-state.service';
import { Breadcrumb, BreadcrumbsService } from '@shared/components/breadcrumbs/breadcrumbs.service';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AdminPaginationComponent } from "../admin-pagination/admin-pagination.component";
import { LoaderComponent } from "@shared/components/loader/loader.component";

@Component({
  selector: 'app-admin-category',
  imports: [
    BreadcrumbsComponent,
    AdminProductCardComponent,
    TranslateModule,
    AdminPaginationComponent,
    LoaderComponent,
],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCategoryComponent implements OnDestroy {
  private readonly stateService = inject(AdminCategoryStateService)
  private readonly breadcrumbsService = inject(BreadcrumbsService)
  private readonly route = inject(ActivatedRoute)
  private readonly currentLang = inject(GetCurrentLangService).currentLang

  protected readonly productsList = this.stateService.products
  protected readonly isLoading = this.stateService.isLoading


  private readonly params = toSignal(
    this.route.paramMap.pipe(
      distinctUntilChanged(), //для избежания дублирующих запросов
    ),
    { requireSync: true }
  );

  private readonly queryParams = toSignal(
    this.route.queryParamMap.pipe(
      distinctUntilChanged(), //для избежания дублирующих запросов
    ),
    { requireSync: true }
  );

  constructor() {
    effect(() => {
      const brcrs = this.breadcrumbsService.brcrTranslations()
      const currentCategory = this.stateService.currentCategory()

      if (brcrs && currentCategory) {
        const breadcrumbs: Breadcrumb[] = [
          {
            label: brcrs.admin.name,
            url: brcrs.admin.url,
            icon: 'manage_accounts',
          },
          {
            label: brcrs.goods.name,
            url: brcrs.goods.url,
          },
          {
            label: currentCategory.name[this.currentLang()],
          },
        ]
        this.breadcrumbsService.setBreadcrumbs(breadcrumbs)
      }
    })

    effect(() => {
      const params = this.params()
      if(Object.keys(params).length) {
        this.stateService.setParams(params)
      }
    })

    effect(() => {
      const queryParams = this.queryParams()
      if(Object.keys(queryParams).length) {
        this.stateService.setQueryParams(queryParams)
      }
    })
  }

  ngOnDestroy(): void {
    this.stateService.resetState()
  }


}
