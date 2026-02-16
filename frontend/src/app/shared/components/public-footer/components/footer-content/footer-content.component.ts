import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LogoComponent } from '../../../logo/logo.component';
import { LocationComponent } from '../../../location/location.component';
import { SubscribeComponent } from '../subscribe/subscribe.component';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';

@Component({
  selector: 'app-footer-content',
  imports: [
    LogoComponent,
    SubscribeComponent,
    FooterNavComponent,
    LocationComponent,
  ],
  templateUrl: './footer-content.component.html',
  styleUrl: './footer-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterContentComponent {

}
