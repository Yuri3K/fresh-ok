import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer-nav',
  imports: [
    // RouterLink,
    TranslateModule
  ],
  templateUrl: './footer-nav.component.html',
  styleUrl: './footer-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterNavComponent {

}
