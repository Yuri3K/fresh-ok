import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselComponent } from '../../../../projects/carousel/src/public-api';

@Component({
  selector: 'app-home',
  imports: [
    TranslateModule,
    CarouselComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  slidesList = [
    {
      title: "Hello 1"
    },
    {
      title: "Hello 2"
    },
    {
      title: "Hello 3"
    }
  ]

  ngOnInit() {
  }

}
