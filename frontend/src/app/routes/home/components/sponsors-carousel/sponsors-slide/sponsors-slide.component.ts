import { Component, input } from '@angular/core';
import { MEDIA_URL } from '../../../../../core/urls';

@Component({
  selector: 'app-sponsors-slide',
  imports: [],
  templateUrl: './sponsors-slide.component.html',
  styleUrl: './sponsors-slide.component.scss'
})
export class SponsorsSlideComponent {
  imgPath = input.required<string>()
  mediaUrl = MEDIA_URL + this.imgPath()
}
