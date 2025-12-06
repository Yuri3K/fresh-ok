import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
// import { M3_CAROUSEL_CONFIG } from '../../projects/m3-carousel/src/lib/m3-carousel.types';
import { NGX_CAROUSEL_CONFIG } from '../../projects/ngx-carousel/src/lib/ngx-carousel.types';

const interceptors = [
  authTokenInterceptor
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    // {
    //   provide: M3_CAROUSEL_CONFIG,
    //   useValue: {
    //     autoplay: true, 
    //     interval: 5000, 
    //     loop: true ,
    //   }
    // },
    {
      provide: NGX_CAROUSEL_CONFIG,
      useValue: {
        autoplay: true, 
        interval: 5000, 
        loop: true ,
      }
    },
    provideRouter(routes),
    provideHttpClient(withInterceptors(interceptors)),
    provideTranslateService({
      // lang: 'en-US', // будет определено в LangsService
      fallbackLang: 'en-US',
      loader: provideTranslateHttpLoader({
        prefix: 'i18n/',
        suffix: '.json'
      })
    }),

    // Дождется инициализации языков перед загрузкой приложения
    // provideAppInitializer(initLangsFactory),
    

    provideLottieOptions({
      player: () => player,
    }),
    provideCacheableAnimationLoader(),
  ]
};
