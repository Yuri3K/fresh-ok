import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselComponent } from '../../../../projects/carousel/src/public-api';
import { SliderService } from '../../core/services/slider.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly sliderService = inject(SliderService)
  private destroyRef = inject(DestroyRef)

  sliderData = this.sliderService.sliderData$
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe()
  
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
    console.log("🔸 sliderData:", this.sliderData)
    
  }

}
