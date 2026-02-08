import { Component, effect, inject, input, signal } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { BtnFlatComponent } from "../../../ui-elems/buttons/btn-flat/btn-flat.component"
import { FormControlNameComponent } from "../../../ui-elems/forms/form-control-name/form-control-name.component"
import { FormControlTextareaComponent } from "../../../ui-elems/forms/form-control-textarea/form-control-textarea.component"
import { TranslateModule } from "@ngx-translate/core"
import { LoaderComponent } from "../../loader/loader.component"
import { FormControlEmailComponent } from "../../../ui-elems/forms/form-control-email/form-control-email.component"
import { dbUser } from "../../../../core/services/user-access.service"
import { FormControlRatingComponent } from "../../../ui-elems/forms/form-control-rating/form-control-rating.component"
import { FormControlCheckboxComponent } from "../../../ui-elems/forms/form-control-checkbox/form-control-checkbox.component"
import { MatDialogRef } from "@angular/material/dialog"
import { LeaveReviewPopupComponent } from "../../dialogs/leave-review-popup/leave-review-popup.component"


@Component({
  selector: 'app-review-form',
  imports: [
    ReactiveFormsModule,
    BtnFlatComponent,
    FormControlEmailComponent,
    FormControlNameComponent,
    FormControlTextareaComponent,
    FormControlRatingComponent,
    FormControlCheckboxComponent,
    TranslateModule,
    LoaderComponent,
  ],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {
  user = input.required<dbUser>()
  private fb = inject(FormBuilder)
  private dialogRef = inject(MatDialogRef<LeaveReviewPopupComponent>)

  submitting = signal(false)
  reviewForm!: FormGroup

  constructor() {
    effect(() => {
      const currentUser = this.user()

      if (currentUser) {
        this.reviewForm = this.fb.group({
          stars: [0, [Validators.required, Validators.min(1)]],
          name: [this.user()?.displayName],
          email: [this.user()?.email, [Validators.required]],
          textarea: ['', [Validators.required]],
          agreement: [false, [Validators.requiredTrue]]
        })
      }
    })
  }

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
    if (this.reviewForm.invalid) return
    this.dialogRef.close({
      user: this.user(),
      review: this.reviewForm.value
    })
  }
}
