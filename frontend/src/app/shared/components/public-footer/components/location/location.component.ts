import { NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';
import { SocialComponent } from '../../../social/social.component';
import { TranslateModule } from '@ngx-translate/core';

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
