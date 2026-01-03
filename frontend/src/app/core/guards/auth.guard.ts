import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, UrlTree, } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { filter, map, Observable, take } from "rxjs";
import { environment } from "../../../environments/environment";
import { LangRouterService } from "../services/lang-router.service";

/**
 * Применяется ТОЛЬКО к роутам, которые НЕ являются публичными и ТРЕБУЮТ авторизации.
 * Срабатывает только когда ROUTER (внутренняя навигация по сайту) пытается выполнить
 * переход на защищенную этим Guard-ом страницу 
 */
function checkAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
  const authService = inject(AuthService)
  const router = inject(Router)
  const navigateService = inject(LangRouterService)
  const lsSavedUrlKey = environment.lsSavedUrlKey


  return authService.user$
    .pipe(
      filter(user => user !== undefined),
      take(1),
      map(user => {
        console.log("🔸 !!! AUTH GUARD !!! user:", user)
        if (user) {
          // Если вошли - очищаем сохраненный URL
          localStorage.removeItem(lsSavedUrlKey)
          return true;
        } 
        console.log("🔸 !!! AUTH GUARD !!! state.url:", state.url)

        // Если пользователь не аутентифицирован и пытается получить доступ к 
        // защищенному маршруту, записываем маршрут в LS, чтобы после успешной 
        // авторизации редиректнуть пользователя на страницу, на которую он пытался 
        // попасть
        if(state.url && state.url !== '/login' && state.url !== '/register') {
          localStorage.setItem(lsSavedUrlKey, state.url)
        }
        
        console.log("🔸 !!! AUTH GUARD  CALLED LOGOUT!!! ")
        // authService.logout().subscribe()

        // console.log("🔸 !!! AUTH GUARD  RETURN FALSE ")
        // return false
        
        console.log("🔸 !!! AUTH GUARD CALLED /LOGIN ")
        const urlWithLang = navigateService.addLangInUrl('/login')
        return router.parseUrl(urlWithLang); // безопасный редирект через UrlTree
      })
    )
}

export const authGuard: CanActivateFn = (route, state: RouterStateSnapshot) => checkAuth(route, state)

export const authChildGuard: CanActivateChildFn = (route, state: RouterStateSnapshot) => checkAuth(route,state)