import { Component, computed, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CatalogItem, CatalogService } from '@core/services/catalog.service';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
import { MEDIA_URL } from '@core/urls';
import { H5TitleComponent } from "@shared/ui-elems/typography/h5-title/h5-title.component";
import { MenuComponent, MenuItem } from "@shared/ui-elems/menues/menu/menu.component";
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryDialogComponent } from '@shared/components/dialogs/admin/add-category-dialog/add-category-dialog.component';
import { UserAccessService } from '@core/services/user-access.service';
import { DeleteDialogComponent } from '@shared/components/dialogs/delete-dialog/delete-dialog.component';
import { finalize, switchMap } from 'rxjs';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { LoaderComponent } from "@shared/components/loader/loader.component";

@Component({
  selector: 'app-category-card',
  imports: [
    MatCardModule,
    MatIconModule,
    H5TitleComponent,
    MenuComponent,
    MatProgressSpinner,
    LoaderComponent
],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
  readonly category = input.required<CatalogItem>()

  protected readonly currentLang = inject(GetCurrentLangService).currentLang
  private translateService = inject(TranslateService)
  private catalogService = inject(CatalogService)
  private readonly dialog = inject(MatDialog)
  private readonly userAccessService = inject(UserAccessService)

  protected readonly isLoading = signal(false)

  private readonly translations = toSignal(
    this.translateService.stream('common'),
    { initialValue: '' }
  )

  private dbUser = toSignal(
    this.userAccessService.dbUser$,
    { initialValue: null }
  )

  protected readonly categoryImg = computed(() => {
    if (this.category().publicId) {
      return `${MEDIA_URL}v${this.category().imgVersion}/${this.category().publicId}`
    } else {
      return ''
    }
  })

  protected readonly menuOptions = computed<MenuItem[]>(() => {
    return [
      {
        text: this.translations()['edit'],
        icon: 'edit',
        action: () => this.openDialogCategory(this.category())
      },
      {
        text: this.translations()['delete'],
        icon: 'delete',
        disabled: !this.dbUser()?.permissions.includes('category.create'),
        action: () => this.openDialogDeleteCategory(this.category())
      },
    ]
  })

  private openDialogCategory(category: CatalogItem) {
    this.dialog.open(AddCategoryDialogComponent, {
      panelClass: ['dialog-category'],
      width: '100vw',
      maxWidth: '650px',
      backdropClass: 'categiry-dialog-overlay',
      data: { category }
    })
  }

  private openDialogDeleteCategory(category: CatalogItem) {
    const deleteDialog = this.dialog.open(DeleteDialogComponent, {
      panelClass: ['red'],
      maxWidth: '700px',
      width: '100vw',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
      data: {
        translations: this.translateService.instant(
          'admin.delete-category-dialog',
        ),
        info: category.slug
      },
    })

    deleteDialog.afterClosed().subscribe(res => {
      if (res) {
        this.isLoading.set(true)

        this.catalogService.removeCategory(category.slug)
          .pipe(
            switchMap(() => this.catalogService.getCatalogList()),
            finalize(() => this.isLoading.set(false)),
          ).subscribe()
      }
    })
  }


}
