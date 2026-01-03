import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, Observable, take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LangRouterService } from '../services/lang-router.service';

/**
 * Применяется ТОЛЬКО к роутам, которые НЕ являются публичными и ТРЕБУЮТ авторизации.
 * Срабатывает только когда ROUTER (внутренняя навигация по сайту) пытается выполнить
 * переход на защищенную этим Guard-ом страницу
 */
function checkAuth(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const navigateService = inject(LangRouterService);
  const lsSavedUrlKey = environment.lsSavedUrlKey;

  return authService.user$.pipe(
    filter((user) => user !== undefined),
    take(1),
    map((user) => {
      if (user) {
        // Если вошли - очищаем сохраненный URL
        localStorage.removeItem(lsSavedUrlKey);
        return true;
      }

      // Если пользователь не аутентифицирован и пытается получить доступ к
      // защищенному маршруту, записываем маршрут в LS, чтобы после успешной
      // авторизации редиректнуть пользователя на страницу, на которую он пытался
      // попасть
      if (state.url && state.url !== '/login' && state.url !== '/register') {
        localStorage.setItem(lsSavedUrlKey, state.url);
      }

      const urlWithLang = navigateService.addLangInUrlArr(['/login']);
      // Безопасный редирект через UrlTree
      return router.createUrlTree(urlWithLang, {
        queryParamsHandling: 'preserve', // сохраняем query параметры
        fragment: route.fragment || undefined, // сохраняем fragment (#anchor)
      }); 
    })
  );
}

export const authGuard: CanActivateFn = (route, state: RouterStateSnapshot) =>
  checkAuth(route, state);

export const authChildGuard: CanActivateChildFn = (
  route,
  state: RouterStateSnapshot
) => checkAuth(route, state);
