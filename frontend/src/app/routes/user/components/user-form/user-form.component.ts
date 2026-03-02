import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { UserAccessService } from '@core/services/user-access.service';
import { TranslateModule } from '@ngx-translate/core';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { FormControlNameComponent } from "@shared/ui-elems/forms/form-control-name/form-control-name.component";
import { FormControlDatepickerComponent } from "@shared/ui-elems/forms/form-control-datepicker/form-control-datepicker.component";
import { CustomSelectorComponent } from "@shared/ui-elems/selectors/custom-selector/custom-selector.component";
import { FormControlPhoneComponent } from "@shared/ui-elems/forms/form-control-phone/form-control-phone.component";
import { FormControlInputComponent } from "@shared/ui-elems/forms/form-control-input/form-control-input.component";
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '@core/services/api.service';
import { catchError, EMPTY, finalize, of, tap } from 'rxjs';
import { DbUser } from '@shared/models';
import { removeNulls } from '@core/utils/remove-nulls.util';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    BtnFlatComponent,
    TranslateModule,
    FormControlNameComponent,
    FormControlDatepickerComponent,
    CustomSelectorComponent,
    FormControlPhoneComponent,
    FormControlInputComponent,
    MatDividerModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  private _fb = inject(FormBuilder)
  private apiService = inject(ApiService)
  private userAccessService = inject(UserAccessService)

  protected submitting = signal(false)
  private dbUser$ = inject(UserAccessService).dbUser$

  protected dbUser = toSignal(
    this.dbUser$,
    { initialValue: undefined }
  )

  userForm!: FormGroup
  maxDate = new Date(Date.now())

  constructor() {
    effect(() => {
      const user = this.dbUser()

      if (user) {
        this.userForm = this._fb.group({
          displayName: [user.displayName, [Validators.required, Validators.minLength(2)]],
          birthday: [user.birthday ?? null],
          gender: [user.gender ?? 'not-set'],
          preferLang: [user.preferLang ?? 'not-set'],
          phone: [user.phone ?? null],
          country: [user.country ?? null],
          city: [user.city ?? null],
          address: [user.address ?? null],
        })
      }
    })
  }

  get nameControl(): FormControl<string> {
    return this.userForm.get('displayName') as FormControl<string>
  }

  get birthdayControl(): FormControl<number | null> {
    return this.userForm.get('birthday') as FormControl<number | null>
  }

  get genderControl(): FormControl<string> {
    return this.userForm.get('gender') as FormControl<string>
  }

  get phoneControl(): FormControl<string> {
    return this.userForm.get('phone') as FormControl<string>
  }

  get preferLangControl(): FormControl<string> {
    return this.userForm.get('preferLang') as FormControl<string>
  }

  get countryControl(): FormControl<string> {
    return this.userForm.get('country') as FormControl<string>
  }

  get cityControl(): FormControl<string> {
    return this.userForm.get('city') as FormControl<string>
  }

  get addressControl(): FormControl<string> {
    return this.userForm.get('address') as FormControl<string>
  }

  protected onSubmit() {
    if (this.userForm.invalid) return

    this.submitting.set(true)

    const data = removeNulls(this.userForm.value)
    console.log("🚀 ~ this.userForm:", this.userForm)
    console.log("🚀 ~ data:", data)

    this.apiService.patch<DbUser>('/users/me', data)
      .pipe(
        tap(user => {
          this.userAccessService.setDbUser(user)

          // Помечаем форму как pristine
          this.userForm.markAsPristine()
          return of(user)
        }),
        finalize(() => this.submitting.set(false)),
        catchError(err => {
          console.log('Update profile error:', err)
          return EMPTY
        })
      ).subscribe()
  }

}
