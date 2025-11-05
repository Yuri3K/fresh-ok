import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, UrlTree, } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { filter, map, Observable, take } from "rxjs";
import { environment } from "../../../environments/environment";

function checkAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
  const authService = inject(AuthService)
  const router = inject(Router)
  const lsSavedUrlKey = environment.lsSavedUrlKey

  return authService.user$
    .pipe(
      filter(user => user !== undefined),
      take(1),
      map(user => {
        if (user) {
          // Если вошли - очищаем сохраненный URL
          localStorage.removeItem(lsSavedUrlKey)
          return true;
        } 

        // Если пользователь не аутентифицирован и пытается получить доступ к защищенному маршруту
        if(state.url && state.url !== '/login' && state.url !== '/register') {
          localStorage.setItem(lsSavedUrlKey, state.url)
        }
        
        authService.logout().subscribe()
        return router.parseUrl('/login'); // безопасный редирект через UrlTree
      })
    )
}

export const authGuard: CanActivateFn = (route, state: RouterStateSnapshot) => checkAuth(route, state)

export const authChildGuard: CanActivateChildFn = (route, state: RouterStateSnapshot) => checkAuth(route,state)