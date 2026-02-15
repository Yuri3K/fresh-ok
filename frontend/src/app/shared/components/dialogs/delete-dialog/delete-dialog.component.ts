import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { H3TitleComponent } from '../../../ui-elems/typography/h3-title/h3-title.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { BtnIconComponent } from "../../../ui-elems/buttons/btn-icon/btn-icon.component";

export interface DeleteDialogData {
  title: string
  question: string
}

@Component({
  selector: 'app-delete-dialog',
  imports: [
    H3TitleComponent,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    TranslateModule,
    BtnIconComponent
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDialogComponent {
  data = inject(MAT_DIALOG_DATA)

  translations = computed<DeleteDialogData>(() => this.data.translations)
  str = computed<string>(() => this.data.info?.text ?? null)
}
