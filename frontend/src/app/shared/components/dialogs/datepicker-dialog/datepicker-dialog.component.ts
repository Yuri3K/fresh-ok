import { ChangeDetectionStrategy, Component, inject, model, viewChild } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { BtnRaisedComponent } from "@shared/ui-elems/buttons/btn-raised/btn-raised.component";
import { EditDateDialogComponent } from '../edit-date-dialog/edit-date-dialog.component';
import { MiniFabBtnComponent } from "@shared/ui-elems/buttons/mini-fab-btn/mini-fab-btn.component";

@Component({
  selector: 'app-calendar-dialog',
  imports: [
    MatDialogModule,
    MatCalendar,
    BtnRaisedComponent,
    TranslateModule,
    MiniFabBtnComponent
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

  private calendar = viewChild.required<MatCalendar<Date>>('calendar')

  protected readonly selected = model<Date | null>(null);
  protected readonly maxDate: Date | null = this.data.maxDate
  protected readonly minDate: Date | null = this.data.minDate

  protected openDialogEditDate() {
    const editDateDialog = this.dialog.open(EditDateDialogComponent, {
      panelClass: ['green'],
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
      width: '100vw',
      maxWidth: '450px',
      data: {
        maxDate: this.maxDate,
        minDate: this.minDate
      }
    })

    editDateDialog.afterClosed().subscribe(result => {
      if (result && !isNaN(result.getTime())) {
        const newDate = new Date(result);
        this.selected.set(newDate);

        // заставляем календарь "перепрыгнуть" на выбранную дату
        if (this.calendar) {
          this.calendar().activeDate = newDate;
        }
      }
    })
  }

  protected saveDate() {
    if (!this.selected()) return

    const timestamp = this.selected()!.getTime();
    this.dialogRef.close(timestamp);
  }
}
