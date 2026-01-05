import { Component, input } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { NgStyle } from '@angular/common';

export interface NewsItem {
  src: string,
  descr: string
}

@Component({
  selector: 'app-news-card',
  imports: [NgStyle],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss'
})
export class NewsCardComponent {
  newsItem = input.required<NewsItem>()

  mediaUrl = environment.cloudinary_url
}
