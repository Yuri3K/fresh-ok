import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { H3TitleComponent } from '../../../ui-elems/typography/h3-title/h3-title.component';
import { MatButtonModule } from '@angular/material/button';
import { BtnIconComponent } from '../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-info-dialog',
  imports: [
    MatDialogModule,
    H3TitleComponent,
    MatButtonModule,
    BtnIconComponent,
    TranslateModule,
],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss'
})
export class InfoDialogComponent {
  data = inject(MAT_DIALOG_DATA)
}

// dfsdfs 