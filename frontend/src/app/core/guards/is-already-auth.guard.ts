import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { filter, map, Observable, take } from "rxjs";
import { AuthService } from "../services/auth.service";

function checkIsAuth(): Observable<boolean | UrlTree> {
  const authService = inject(AuthService)
  const router = inject(Router)

  return authService.user$
    .pipe(
      filter(user => user !== undefined),
      take(1),
      map(user => {
        // Если пользователь АУТЕНТИФИЦИРОВАН (user есть)
        if (user) {
          // Запрещаем доступ к /login или /register и перенаправляем на /home
          return router.parseUrl('/home')
        }

        // Если пользователь НЕ аутентифицирован (user === null), разрешаем доступ 
        // на страницу /login или /register
        return true
      })
    )
}

export const isAlreadyAuthGuard: CanActivateFn = () => checkIsAuth()