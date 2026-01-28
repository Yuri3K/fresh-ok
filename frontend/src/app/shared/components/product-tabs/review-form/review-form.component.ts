import { Component, inject, input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { dbUser } from '../../../../core/services/user-access.service';

@Component({
  selector: 'app-review-form',
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {
  private fb = inject(FormBuilder)
  user = input.required<dbUser>()



  private reviewForm = this.fb.group({
    revirewText: ['', [Validators.required]],
    name: [this.user().displayName],
    email: [this.user().email, [Validators.email]]
  })
}
