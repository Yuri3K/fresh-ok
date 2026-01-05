import { Component, input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MEDIA_URL } from '../../../../../core/urls';

export interface NewsItem {
  src: string
  descr: string
  date: {
    day: string
    month: string
  }
}

@Component({
  selector: 'app-news-card',
  imports: [
    NgStyle,
  ],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss'
})
export class NewsCardComponent {
  newsItem = input.required<NewsItem>()

  mediaUrl = MEDIA_URL
}
