import { NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SocialComponent } from '../social/social.component';

@Component({
  selector: 'app-location',
  imports: [
    NgStyle,
    SocialComponent,
    TranslateModule,
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {
  textColor = input.required()
  iconColor = input.required()
}
