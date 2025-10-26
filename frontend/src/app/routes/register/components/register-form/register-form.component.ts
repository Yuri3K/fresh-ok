import { Component, inject, signal } from '@angular/core';
import { FormControlPasswordComponent } from '../../../../shared/ui-elems/forms/form-control-pwd/form-control-pwd.component';
import { FormControlEmailComponent } from '../../../../shared/ui-elems/forms/form-control-email/form-control-email.component';
import { FormControlNameComponent } from '../../../../shared/ui-elems/forms/form-control-name/form-control-name.component';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnFlatComponent } from '../../../../shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { ApiService } from '../../../../core/services/api.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    BtnFlatComponent,
    FormControlPasswordComponent,
    FormControlEmailComponent,
    FormControlNameComponent,
    TranslateModule
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private apiService = inject(ApiService)

  submitting = signal(false)
  registerForm = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  get displayNameControl(): FormControl<string> {
    return this.registerForm.get('displayName') as FormControl<string>
  }

  get emailControl(): FormControl<string> {
    return this.registerForm.get('email') as FormControl<string>
  }

  get passwordControl(): FormControl<string> {
    return this.registerForm.get('password') as FormControl<string>
  }

  onSubmit() {
    if (this.registerForm.invalid) return

    const formData = this.registerForm.value

    this.apiService.postWithoutToken('/register', formData)
      .subscribe((res: any) => {
        if (res.result == 'ok') {
          this.registerForm.reset()
          this.router.navigate(['/login'])
        }
      })
  }
}
