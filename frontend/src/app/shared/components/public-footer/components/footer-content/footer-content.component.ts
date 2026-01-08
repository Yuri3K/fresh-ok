import { Component } from '@angular/core';
import { LocationComponent } from '../location/location.component';
import { LogoComponent } from '../../../logo/logo.component';

@Component({
  selector: 'app-footer-content',
  imports: [
    LogoComponent,
    LocationComponent
  ],
  templateUrl: './footer-content.component.html',
  styleUrl: './footer-content.component.scss'
})
export class FooterContentComponent {

}
