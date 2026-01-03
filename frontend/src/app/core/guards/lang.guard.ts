import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LangsService } from '../services/langs.service';
import { filter, map, Observable, take } from 'rxjs';

export const LangGuard: CanActivateFn = (
  route,
  state
): Observable<boolean | UrlTree> => {
  console.log('🔸 !!!LangGuard!!!:');

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
  return langs$.pipe(
    filter((langs) => langs.length > 0),
    take(1),
    map((langs) => {
      const langParam = route.params['lang']; // берем :lang из URL

      // Если в URL не указан язык
      if (!langParam) {
        // Определяем язык автоматически
        const targetLng = langsService.resolveTargetLang(); // en, ru, uk

        
        return router.parseUrl(`/${targetLng}${state.url}`); // переключаемся на автоматически определенный язык
      }

      // Если я зык в URL был указан, но язык не поддерживается
      if (!langsService.isSupported(langParam)) {
        const fallback = langsService.resolveTargetLang(); // пытаемся автоматически определить язык и если не получается, то применим язык для fallback
        return router.parseUrl(`/${fallback}${state.url}`); // переходим на страницу используя язык, который попал в fallback
      }

      // Если язык есть в URL этот и язык поддерживается, то переходим поэтому URL
      return true;
    })
  );
};
