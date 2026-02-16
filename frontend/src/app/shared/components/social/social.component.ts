import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MEDIA_URL } from '../../../core/urls';
import { SvgIconPipe } from '../../../core/pipes/svg-icon.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-social',
  imports: [
    SvgIconPipe,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './social.component.html',
  styleUrl: './social.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialComponent {
  iconColor = input.required()

  socials = [
    {
      iconUrl: `${MEDIA_URL}social/facebook.svg`,
      socialUrl: 'https://www.facebook.com/login/'
    },
    {
      iconUrl: `${MEDIA_URL}social/youtube.svg`,
      socialUrl: 'https://www.youtube.com/'
    },
    {
      iconUrl: `${MEDIA_URL}social/telegram.svg`,
      socialUrl: 'https://web.telegram.org/a/'
    }
  ]
}
