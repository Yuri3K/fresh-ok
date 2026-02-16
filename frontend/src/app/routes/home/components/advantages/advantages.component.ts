import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconPipe } from '../../../../core/pipes/svg-icon.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MEDIA_URL } from '../../../../core/urls';

@Component({
  selector: 'app-advantages',
  imports: [
    SvgIconPipe,
    TranslateModule,
    MatIconModule
  ],
  templateUrl: './advantages.component.html',
  styleUrl: './advantages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvantagesComponent {
  mediaUrl = MEDIA_URL

}
