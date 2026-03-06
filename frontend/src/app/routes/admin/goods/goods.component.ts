import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { CatalogService } from '@core/services/catalog.service';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryCardComponent } from '@shared/components/admin/category-card/category-card.component';
import { AddCategoryDialogComponent } from '@shared/components/dialogs/admin/add-category-dialog/add-category-dialog.component';
import { BtnFlatComponent } from "@shared/ui-elems/buttons/btn-flat/btn-flat.component";

@Component({
  selector: 'app-goods',
  imports: [
    CategoryCardComponent,
    BtnFlatComponent,
    TranslateModule
],
  templateUrl: './goods.component.html',
  styleUrl: './goods.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoodsComponent {
  private readonly catalogService = inject(CatalogService)
  private readonly dialog = inject(MatDialog)

  protected readonly categories = toSignal(
    this.catalogService.catalogList$,
    {requireSync: true}
  )


  protected openAddCategoryDialog() {
    this.dialog.open(AddCategoryDialogComponent, {
      panelClass: ['dialog-category'],
      width: '100vw',
      maxWidth: '650px',
      backdropClass: 'categiry-dialog-overlay',
      data: {category: null}
    })
  }
}
