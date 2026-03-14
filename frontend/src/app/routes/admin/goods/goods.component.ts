import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogService } from '@core/services/catalog.service';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryCardComponent } from '@shared/components/admin/category-card/category-card.component';
import { AddCategoryDialogComponent } from '@shared/components/dialogs/admin/add-category-dialog/add-category-dialog.component';
import { BtnFlatComponent } from "@shared/ui-elems/buttons/btn-flat/btn-flat.component";
import { H2TitleComponent } from "@shared/ui-elems/typography/h2-title/h2-title.component";
import { BreadcrumbsComponent } from "@shared/components/breadcrumbs/breadcrumbs.component";
import { Breadcrumb, BreadcrumbsService } from '@shared/components/breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'app-goods',
  imports: [
    CategoryCardComponent,
    BtnFlatComponent,
    TranslateModule,
    H2TitleComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './goods.component.html',
  styleUrl: './goods.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoodsComponent {
  private readonly catalogService = inject(CatalogService)
  private readonly dialog = inject(MatDialog)
  private readonly breadcrumbsService = inject(BreadcrumbsService)

  protected readonly categories = this.catalogService.catalogListAdmin

  constructor() {
    this.catalogService.getCatalogListAdmin().subscribe()

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
            label: brcrs.goods.name,
          },
        ]
        this.breadcrumbsService.setBreadcrumbs(breadcrumbs)
      }
    })
  }

  protected openAddCategoryDialog() {
    this.dialog.open(AddCategoryDialogComponent, {
      panelClass: ['dialog-full-width'],
      width: '100vw',
      maxWidth: '650px',
      backdropClass: 'categiry-dialog-overlay',
      data: { category: null }
    })
  }
}
