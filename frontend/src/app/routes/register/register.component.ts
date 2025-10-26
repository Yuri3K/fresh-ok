import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { H2TitleComponent } from '../../shared/ui-elems/typography/h2-title/h2-title.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { GoToLoginComponent } from './components/go-to-login/go-to-login.component';

@Component({
  selector: 'app-register',
  imports: [
    TranslateModule,
    H2TitleComponent,
    RegisterFormComponent,
    GoToLoginComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
}
