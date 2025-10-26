import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-go-to-login',
  imports: [
    TranslateModule,
    RouterLink
  ],
  templateUrl: './go-to-login.component.html',
  styleUrl: './go-to-login.component.scss'
})
export class GoToLoginComponent {

}
