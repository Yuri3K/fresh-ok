import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-go-to-register',
  imports: [
    TranslateModule,
    RouterLink
  ],
  templateUrl: './go-to-register.component.html',
  styleUrl: './go-to-register.component.scss'
})
export class GoToRegisterComponent {

}
