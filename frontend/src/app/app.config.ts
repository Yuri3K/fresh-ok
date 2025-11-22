import { APP_INITIALIZER, ApplicationConfig, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initLangsFactory } from './core/init/langs.init';
import { LangsService } from './core/services/langs.service';

const interceptors = [
  authTokenInterceptor
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
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
    provideAppInitializer(initLangsFactory),
    

    provideLottieOptions({
      player: () => player,
    }),
    provideCacheableAnimationLoader(),
  ]
};
