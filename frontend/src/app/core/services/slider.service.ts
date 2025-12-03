import { inject, Injectable } from '@angular/core';
import { CarouselSlide } from '../../../../projects/carousel/src/lib/carousel.types';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private readonly slidesSubject = new BehaviorSubject<CarouselSlide[]>([])

  readonly slides$ = this.slidesSubject.asObservable()

  private readonly translateService = inject(TranslateService)
  sliderData$ = this.translateService.stream('homepage.slider')
    .pipe(
      tap((slides: CarouselSlide[]) => {
        const processedSlides = slides.map(s => {
          return {
            ...s,
            imageUrl: `${environment.cloudinary_url}${s.imageUrl}`
          }
        })
        this.slidesSubject.next(processedSlides)
      })
    )

  
}
