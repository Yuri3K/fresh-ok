import { Component, inject, signal } from "@angular/core"
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms"
import { BtnFlatComponent } from "../../../ui-elems/buttons/btn-flat/btn-flat.component"
import { FormControlNameComponent } from "../../../ui-elems/forms/form-control-name/form-control-name.component"
import { FormControlTextareaComponent } from "../../../ui-elems/forms/form-control-textarea/form-control-textarea.component"
import { TranslateModule } from "@ngx-translate/core"
import { LoaderComponent } from "../../loader/loader.component"
import { FormControlEmailComponent } from "../../../ui-elems/forms/form-control-email/form-control-email.component"
import { UserAccessService } from "../../../../core/services/user-access.service"
import { toSignal } from "@angular/core/rxjs-interop"
import { FormControlRatingComponent } from "../../../ui-elems/forms/form-control-rating/form-control-rating.component"


@Component({
  selector: 'app-review-form',
  imports: [
    ReactiveFormsModule,
    BtnFlatComponent,
    FormControlEmailComponent,
    FormControlNameComponent,
    FormControlTextareaComponent,
    FormControlRatingComponent,
    TranslateModule,
    LoaderComponent,
  ],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {
  private fb = inject(FormBuilder)
  private userAccessService = inject(UserAccessService)

  submitting = signal(false)
  user = toSignal(
    this.userAccessService.dbUser$,
    {initialValue: null}
  )

  reviewForm = this.fb.group({
    stars: [0, [Validators.required]],
    name: [this.user()?.displayName],
    email: [this.user()?.email, [Validators.required]],
    textarea: ['', [Validators.required]],
    agreement: [false, [Validators.required]]
  })

  get starsControl(): FormControl<number> {
    return this.reviewForm.get('stars') as FormControl<number>
  }

  get nameControl(): FormControl<string> {
    return this.reviewForm.get('name') as FormControl<string>
  }

  get emailControl(): FormControl<string> {
    return this.reviewForm.get('email') as FormControl<string>
  }

  get textareaControl(): FormControl<string> {
    return this.reviewForm.get('textarea') as FormControl<string>
  }

  get agreementControl(): FormControl<boolean> {
    return this.reviewForm.get('agreement') as FormControl<boolean>
  }

  onSubmit() {
    if(this.reviewForm.invalid) return
  }
}
// asdf