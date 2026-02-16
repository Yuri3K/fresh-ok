import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControlPasswordComponent } from '../../../../shared/ui-elems/forms/form-control-pwd/form-control-pwd.component';
import { FormControlEmailComponent } from '../../../../shared/ui-elems/forms/form-control-email/form-control-email.component';
import { FormControlNameComponent } from '../../../../shared/ui-elems/forms/form-control-name/form-control-name.component';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnFlatComponent } from '../../../../shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { ApiService } from '../../../../core/services/api.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { emailExistsValidator } from '../../../../core/validators/email-exists.validator';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { finalize } from 'rxjs';
import { getAuth } from 'firebase/auth';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    BtnFlatComponent,
    FormControlPasswordComponent,
    FormControlEmailComponent,
    FormControlNameComponent,
    TranslateModule,
    LoaderComponent
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent implements OnInit {
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private apiService = inject(ApiService)
  private snackbarService = inject(SnackbarService)
  private translateService = inject(TranslateService)
  private authService = inject(AuthService)


  submitting = signal(false)
  registerForm = this.fb.group({
    displayName: ['testUser', [Validators.required, Validators.minLength(2)]],
    email: ['testuser@gmail.com', [Validators.required, Validators.email], [emailExistsValidator(this.apiService)]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
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

  ngOnInit() {
    // Чтобы сразу отобразить ошибку про уже зарегистрированном email, не дожидаясь пока пользователь 
    // снимет выделение с emailControl, нужно следить за этим контролом и вручную изменять его статусы 
    this.emailControl.statusChanges.subscribe(status => {
      if (status === 'INVALID' && this.emailControl.hasError('emailExists')) {
        this.emailControl.markAsTouched();
        this.emailControl.markAsDirty();
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return
    this.submitting.set(true)
    const formData = this.registerForm.value
    const auth = getAuth()

    this.apiService.postWithoutToken('/register-user', formData)
      .pipe(
        finalize(() => {
          this.submitting.set(false)
        })
      ).subscribe({
        next: async (res: any) => {
          if (res.result == 'ok') {
            this.registerForm.reset()
            this.authService.signInWithEmailAndPassword(
              formData.email!,
              formData.password!
            ).subscribe()
          }
        },
        error: err => {
          const message = this.translateService.instant('register-page.register-error', {
            email: formData.email
          })
          this.snackbarService.openSnackBar(message)
          console.log("error register user", err)
        }
      })
  }
}
