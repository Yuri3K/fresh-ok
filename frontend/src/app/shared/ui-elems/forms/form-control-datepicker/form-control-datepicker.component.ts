import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DatepickerDialogComponent } from '@shared/components/dialogs/datepicker-dialog/datepicker-dialog.component';
import { BtnIconComponent } from '@shared/ui-elems/buttons/btn-icon/btn-icon.component';
import { H6TitleComponent } from "@shared/ui-elems/typography/h6-title/h6-title.component";

@Component({
  selector: 'app-form-control-datepicker',
  imports: [
    BtnIconComponent,
    H6TitleComponent,
    TranslateModule,
],
  templateUrl: './form-control-datepicker.component.html',
  styleUrl: './form-control-datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormControlDatepickerComponent {
  datepickerControl = input.required<FormControl>()
  title = input('')

  private dialog = inject(MatDialog)

  protected openDatepicker() {
    const datapickerDialog = this.dialog.open(DatepickerDialogComponent, {

      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
    })

    datapickerDialog.afterClosed().subscribe(result => {
      if(result) {
        this.datepickerControl().setValue(result)
      }
    })
  }
}
