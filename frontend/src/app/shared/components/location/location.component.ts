import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SocialComponent } from '../social/social.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-location',
  imports: [
    NgStyle,
    SocialComponent,
    TranslateModule,
    MatIconModule,
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationComponent {
  textColor = input.required()
  iconColor = input.required()
  textWithIcon = input(false)
}
