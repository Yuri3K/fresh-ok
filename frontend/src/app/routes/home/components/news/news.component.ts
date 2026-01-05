import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { H2TitleComponent } from '../../../../shared/ui-elems/typography/h2-title/h2-title.component';
import { NewsCardComponent } from './news-card/news-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news',
  imports: [
    TranslateModule,
    H2TitleComponent,
    NewsCardComponent,
    RouterLink
],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {

}
