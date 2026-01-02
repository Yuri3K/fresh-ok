import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NgxCarouselConfig } from 'ngx-freshok-carousel';

export interface CarouselSlide {
  id: string
  title: string
  subtitle: string
  descr: string
  btn: string
  link: string
  imageUrl: string
}

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private readonly slidesSubject = new BehaviorSubject<CarouselSlide[]>([])

  readonly slides$ = this.slidesSubject.asObservable()

  private readonly translateService = inject(TranslateService)

  readonly config: NgxCarouselConfig = {
    autoplay: false, 
    breakpoints: [
      {
        breakpoint: 0, // до 768
        showArrows: false,
        showDots: true,
      },
      {
        breakpoint: 768, // от 768
        showArrows: true,
        showDots: false,
      },
      {
        breakpoint: 1024, // от 1024
        showArrows: true,
        showDots: false,
      },
    ]
  }

  getSliderData(): Observable<CarouselSlide[]> {
    return this.translateService.stream('homepage.slider')
    .pipe(
      tap((slides: CarouselSlide[]) => {
          console.log("🚀 ~ this.translateService.getCurrentLang():", this.translateService.getCurrentLang())
          console.log("🚀 ~ slides:", slides)
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
}
