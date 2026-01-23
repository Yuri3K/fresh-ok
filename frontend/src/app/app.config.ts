import { ApplicationConfig, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NGX_CAROUSEL_CONFIG } from 'ngx-freshok-carousel';
import { initLangsFactory } from './core/init/langs.init';
import { langInterceptor } from './core/interceptors/lang.interceptor';

const interceptors = [
  langInterceptor,         // 1. Сначала добавляем язык
  authTokenInterceptor,    // 2. Потом токен
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    {
      provide: NGX_CAROUSEL_CONFIG,
      useValue: {
        autoplay: true,
        interval: 5000,
        loop: true,
        pauseOnHover: true,
      }
    },
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // при навигации 
        // по роутам, не передаем 
        // управление браузеру, а сами определяем состояние 
        // скролла при переходе на другую страницу. 
        // Теперь при обычном переходе на страницу, 
        // страница всегда будет проскроллена вверх, 
        // а не сохранять скролл предыдущей страницы, 
        // как это делают некоторые браузеры. Если нужно
        // сохранить скролл (например, добавляем queryParam
        // в фильтре, юзаем navigate и не хотим, чтобы страница 
        // прыгнула наверх, то добавляем skipLocationChange: false,
        // replaceUrl: true) 
        // Пример:
        //   this.router.navigate([], {
        //   relativePath: this.route,
        //   queryParams: { filter: 'new', sort: 'price' },
        //   queryParamsHandling: 'merge',
        //   skipLocationChange: false,
        //   replaceUrl: true // заменяет текущий URL вместо добавления в историю
        // });
        // Но в данном проекте это не рбудет работать, так как весь контент 
        // обернут в mat-sidenav-container и Angular Material берет поведение
        // скролла на себя. Для решенея проблемы был создан RestoreScrollService
        // который после навигации восстанавливает скролл.
        // Пример:
        //this.router.navigate([], {
        //   relativeTo: this.route,
        //   queryParams: params,
        //   queryParamsHandling: 'merge',
        // }).then(() => this.restoreScrollService.restoreScroll());
        // Для того чтобы страница перекидыалась по умолчанию наверх
        // в PublicLayoutComponent была прописана для этого логика 
        anchorScrolling: 'enabled'
      }),
      withViewTransitions()
    ),
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
