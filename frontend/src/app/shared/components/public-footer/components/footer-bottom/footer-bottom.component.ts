import { Component } from '@angular/core';
import { CopyrightComponent } from '../copyright/copyright.component';

@Component({
  selector: 'app-footer-bottom',
  imports: [
    CopyrightComponent,
  ],
  templateUrl: './footer-bottom.component.html',
  styleUrl: './footer-bottom.component.scss'
})
export class FooterBottomComponent {

}
