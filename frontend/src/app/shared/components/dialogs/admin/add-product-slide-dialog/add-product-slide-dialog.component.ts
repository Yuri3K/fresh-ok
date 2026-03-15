import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { BtnIconComponent } from "@shared/ui-elems/buttons/btn-icon/btn-icon.component";
import { H4TitleComponent } from "@shared/ui-elems/typography/h4-title/h4-title.component";

@Component({
  selector: 'app-add-product-slide-dialog',
  imports: [
    BtnIconComponent,
    TranslateModule,
    H4TitleComponent,
    MatDialogModule,
],
  templateUrl: './add-product-slide-dialog.component.html',
  styleUrl: './add-product-slide-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductSlideDialogComponent {
  protected readonly dialogRef = inject(DialogRef)
}
