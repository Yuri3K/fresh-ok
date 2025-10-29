import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnFlatComponent } from '../../../../shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { FormControlPasswordComponent } from '../../../../shared/ui-elems/forms/form-control-pwd/form-control-pwd.component';
import { FormControlEmailComponent } from '../../../../shared/ui-elems/forms/form-control-email/form-control-email.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    BtnFlatComponent,
    FormControlPasswordComponent,
    FormControlEmailComponent,
    TranslateModule,
    LoaderComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)

  submitting = signal(false)
  loginForm = this.fb.group({
    email: ['testuser@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]]
  })

  get emailControl(): FormControl<string> {
    return this.loginForm.get('email') as FormControl<string>
  }

  get passwordControl(): FormControl<string> {
    return this.loginForm.get('password') as FormControl<string>
  }

  onSubmit() {
    if(this.loginForm.invalid) {
      return
    }
    this.submitting.set(true)

    const formData = this.loginForm.value

    this.authService.signInWithEmailAndPassword(formData.email!, formData.password!)
    .pipe(finalize(() => this.submitting.set(false)))
    .subscribe()
  }
}
