import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router, UrlTree, } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { filter, map, Observable, take } from "rxjs";

function checkAuth(): Observable<boolean | UrlTree> {
  const authService = inject(AuthService)
  const router = inject(Router)

  return authService.user$
    .pipe(
      filter(user => user !== undefined),
      take(1),
      map(user => {
        if (user) return true;
        authService.logout().subscribe()
        return router.parseUrl('/login'); // безопасный редирект через UrlTree
      })
    )
}

export const authGuard: CanActivateFn = () => checkAuth()

export const authChildGuard: CanActivateChildFn = () => checkAuth()