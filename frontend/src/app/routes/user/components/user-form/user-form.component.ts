import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormControlName } from '@angular/forms';
import { UserAccessService } from '@core/services/user-access.service';
import { TranslateModule } from '@ngx-translate/core';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { FormControlNameComponent } from "@shared/ui-elems/forms/form-control-name/form-control-name.component";
import { FormControlDatepickerComponent } from "@shared/ui-elems/forms/form-control-datepicker/form-control-datepicker.component";

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    BtnFlatComponent,
    TranslateModule,
    FormControlNameComponent,
    FormControlDatepickerComponent
],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  private _fb = inject(FormBuilder)
  protected submitting = signal(false)
  private dbUser$ = inject(UserAccessService).dbUser$

  protected dbUser = toSignal(
    this.dbUser$,
    { initialValue: undefined }
  )

  userForm!: FormGroup

  constructor() {
    effect(() => {
      const user = this.dbUser()

      if (user) {
        this.userForm = this._fb.group({
          name: [user.displayName, [Validators.required]],
          birthday: [user.birthday ?? null],
          gender: [user.gender ?? null],
          preferLang: [user.lang ?? null],
          phone: [user.phone ?? null],
          country: [user.country ?? null],
          city: [user.city ?? null],
          address: [user.address ?? null],
          description: [user.description ?? null],
          registrationDate: [user.registrationDate ?? null],
        })
      }
    })
  }

  get nameControl(): FormControl<string> {
    return this.userForm.get('name') as FormControl<string>
  }

  get birthdayControl(): FormControl<number> {
    return this.userForm.get('birthday') as FormControl<number>
  }

  protected onSubmit() {

  }

}
