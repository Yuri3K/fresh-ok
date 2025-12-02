import { inject, Injectable } from '@angular/core';
import { CarouselSlide } from '../../../../projects/carousel/src/lib/carousel.types';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SliderService {
  slides!: CarouselSlide[]

  private readonly translateService = inject(TranslateService)
  sliderData = this.translateService.stream('')
    .pipe(
      tap(data => {
        console.log("!!! DATA !!!!", data)
      })
    )

  
}
