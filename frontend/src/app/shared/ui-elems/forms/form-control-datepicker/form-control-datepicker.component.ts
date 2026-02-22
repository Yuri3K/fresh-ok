import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
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
export class FormControlDatepickerComponent implements OnInit {
  datepickerControl = input.required<FormControl<number | null>>()
  title = input('')
  readonly maxDate = input<Date | null>(null);
  readonly minDate = input<Date | null>(null);
  private readonly dialog = inject(MatDialog)
  private readonly locale = inject(GetCurrentLangService).currentLocale
  private destroyRef = inject(DestroyRef)


  private birthdayTimestamp = signal<number | null>(null)

  protected readonly birthday = computed(() => {
    const timestamp = this.birthdayTimestamp()
    if (timestamp) {
      return new Intl.DateTimeFormat(this.locale(), {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date(timestamp));
    } else return ''
  })

  ngOnInit() {
    this.datepickerControl().valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.birthdayTimestamp.set(value)
      })
  }

  protected openDatepicker() {
    const datapickerDialog = this.dialog.open(DatepickerDialogComponent, {
      panelClass: ['green'],
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
      width: '100vw',
      maxWidth: '500px',
      data: {
        maxDate: this.maxDate(),
        minDate: this.minDate(),
      }
    })

    datapickerDialog.afterClosed().subscribe(result => {
      if (result) {
        this.datepickerControl().setValue(result)
      }
    })
  }

}
