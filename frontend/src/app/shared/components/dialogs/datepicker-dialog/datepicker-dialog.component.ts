import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { BtnIconComponent } from "@shared/ui-elems/buttons/btn-icon/btn-icon.component";
import { BtnRaisedComponent } from "@shared/ui-elems/buttons/btn-raised/btn-raised.component";
import { EditDateDialogComponent } from '../edit-date-dialog/edit-date-dialog.component';

@Component({
  selector: 'app-calendar-dialog',
  imports: [
    MatDialogModule,
    MatCalendar,
    BtnIconComponent,
    BtnRaisedComponent,
    TranslateModule
  ],
  templateUrl: './datepicker-dialog.component.html',
  styleUrl: './datepicker-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ]
})
export class DatepickerDialogComponent {
  protected dialogRef = inject(MatDialogRef<DatepickerDialogComponent>)
  protected readonly dialog = inject(MatDialog);
  protected readonly data = inject(MAT_DIALOG_DATA);

  selected = model<Date | null>(null);
  readonly maxDate = new Date();

  protected openDialogEditDate() {
    const editDateDialog = this.dialog.open(EditDateDialogComponent, {
      panelClass: []
    })

    editDateDialog.afterClosed().subscribe(result => {
      if (result && !isNaN(result.getTime())) {
        this.selected.set(result);
      }
    })
  }

  protected saveDate() {
    if (!this.selected()) return

    const timestamp = this.selected()!.getTime();
    this.dialogRef.close(timestamp);
  }
}
