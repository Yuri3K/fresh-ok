import { Component } from '@angular/core';
import { FooterBottomComponent } from './components/footer-bottom/footer-bottom.component';
import { FooterContentComponent } from './components/footer-content/footer-content.component';

@Component({
  selector: 'app-public-footer',
  imports: [
    FooterBottomComponent,
    FooterContentComponent
  ],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss'
})
export class PublicFooterComponent {

}
