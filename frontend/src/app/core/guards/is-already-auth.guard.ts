import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { filter, map, Observable, take } from "rxjs";
import { AuthService } from "../services/auth.service";
import { LangRouterService } from "../services/lang-router.service";

// Используется для запрета доступа к страницам /login или /register
// в случае, когда пользователь уже АУТЕНТИФИЦИРОВАН (user есть)
function checkIsAuth(): Observable<boolean | UrlTree> {
  const authService = inject(AuthService)
  const router = inject(Router)
  const navigateService = inject(LangRouterService)

  return authService.user$
    .pipe(
      filter(user => user !== undefined),
      take(1),
      map(user => {
        // Если пользователь АУТЕНТИФИЦИРОВАН (user есть)
        if (user) {
          // ЗАПРЕЩАЕМ доступ к /login или /register и перенаправляем на /home
          console.log("ALREADY AUTH CALLED /HOME")
          const urlWithLang = navigateService.addLangInUrl('/home')
          return router.parseUrl(urlWithLang)
        }

        // Если пользователь НЕ аутентифицирован (user === null), разрешаем доступ 
        // на страницу /login или /register
        return true
      })
    )
}

export const isAlreadyAuthGuard: CanActivateFn = () => checkIsAuth()