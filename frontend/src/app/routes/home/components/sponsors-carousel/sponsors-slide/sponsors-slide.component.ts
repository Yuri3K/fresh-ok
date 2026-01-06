import { Component, input } from '@angular/core';
import { MEDIA_URL } from '../../../../../core/urls';
import { Sponsor } from '../services/sponsors.service';

@Component({
  selector: 'app-sponsors-slide',
  imports: [],
  templateUrl: './sponsors-slide.component.html',
  styleUrl: './sponsors-slide.component.scss'
})
export class SponsorsSlideComponent {
  sponsor = input.required<Partial<Sponsor>>()

}
