import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LangsService } from '../services/langs.service';
import { filter, map, Observable, take } from 'rxjs';
import { LangRouterService } from '../services/lang-router.service';

export const LangGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  console.log('🔸 !!!LangGuard!!!:');

  const navigateService = inject(LangRouterService);
  const langsService = inject(LangsService);
  const langs$ = langsService.langs$;
  const router = inject(Router);

  // При старте приложения языки еще не получены с сервера, поэтому
  // вызов langsService.resolveTargetLang() вернет fallback язык.
  // Поэтому ждем получение языков и потом продолжаем навигацию.
  // Если langsService.init() вызывать не в app.component.ts, а в
  // app.config.ts (через provideAppInitializer(initLangsFactory)),
  // то приложение запуститься только после получения языков и ждать как
  // сейчас сделано не будет ножно.
  // Сейчас не получаем языки через provideAppInitializer(initLangsFactory)
  // из-за холодного старта сервера на живом сайте.
  // return langs$.pipe(
  //   filter((langs) => langs.length > 0),
  //   take(1),
  //   map((langs) => {
      const langParam = route.params['lang']; // берем :lang из URL
      console.log("🔸 langParam:", langParam)

      // Если в URL не указан язык
      if (!langParam) {
        // Определяем язык автоматически
        const targetLng = langsService.resolveTargetLang(); // en, ru, uk

        // Используем createUrlTree для сохранения query параметров
        return router.createUrlTree([targetLng, ...getPathSegments(state.url)], {
          queryParamsHandling: 'preserve', // сохраняем query параметры
          fragment: route.fragment || undefined, // сохраняем fragment (#anchor)
        });
      }

      // Если язык в URL был указан, но язык не поддерживается
      if (!langsService.isSupported(langParam)) {
        // Пытаемся автоматически определить язык и если не получается, то применим язык по дефолту
        const fallback = langsService.resolveTargetLang();

        // Переходим на страницу используя язык, который попал в fallback
        // Используем createUrlTree для сохранения query параметров
        return router.createUrlTree([fallback, ...getPathSegments(state.url)], {
          queryParamsHandling: 'preserve', // сохраняем query параметры
          fragment: route.fragment || undefined, // сохраняем fragment (#anchor)
        });
      }

      // Если язык есть в URL и этот язык поддерживается, то переходим поэтому URL
      return true;
  //   })
  // );
};

// Вспомогательная функция для извлечения сегментов пути
function getPathSegments(url: string): string[] {
  // Убираем query параметры и fragment, разбиваем на сегменты
  const path = url.split('?')[0].split('#')[0];
  return path.split('/').filter((segment) => segment.length > 0);
}
