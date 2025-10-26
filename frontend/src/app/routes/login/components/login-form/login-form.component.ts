import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnFlatComponent } from '../../../../shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { FormControlPasswordComponent } from '../../../../shared/ui-elems/forms/form-control-pwd/form-control-pwd.component';
import { FormControlEmailComponent } from '../../../../shared/ui-elems/forms/form-control-email/form-control-email.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    BtnFlatComponent,
    FormControlPasswordComponent,
    FormControlEmailComponent,
    TranslateModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private apiService = inject(ApiService)
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

    const formData = this.loginForm.value

    this.authService.signInWithEmailAndPassword(formData.email!, formData.password!)
  }
}
