import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '@shared/models';
import { BtnIconComponent } from "@shared/ui-elems/buttons/btn-icon/btn-icon.component";
import { H3TitleComponent } from "@shared/ui-elems/typography/h3-title/h3-title.component";
import { ProductSlidesComponent } from "./components/product-slides/product-slides.component";

@Component({
  selector: 'app-add-product-dialog',
  imports: [
    MatDialogModule,
    BtnIconComponent,
    TranslateModule,
    H3TitleComponent,
    ProductSlidesComponent
],
  templateUrl: './add-product-dialog.component.html',
  styleUrl: './add-product-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductDialogComponent {

  readonly data = inject(MAT_DIALOG_DATA)
  protected readonly dialogRef = inject(MatDialogRef)

  protected readonly product = computed<Product>(() => this.data?.product)
  protected readonly isEditMode = computed(() => {
    return !!this.product()
  })


}
