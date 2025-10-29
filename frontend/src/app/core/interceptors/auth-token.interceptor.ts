import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, from, Observable, switchMap, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { SKIP_AUTH } from "./auth-context";

export const authTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (
    !req.url.startsWith(environment.serverUrl) ||
    req.context.get(SKIP_AUTH)
  ) {
    return next(req)
  }

  return authService.getIdToken(false)
    .pipe(
      switchMap(token => {
        const authReq = token
          ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : req

        return next(authReq)
          .pipe(
            catchError((err: unknown) => {
              const httpErr = err as HttpErrorResponse
              if (httpErr.status === 401) {
                return authService.getIdToken(true)
                  .pipe(
                    switchMap(newToken => {
                      if (newToken) {
                        const retried = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })
                        return next(retried)
                      }
                      authService.logout().subscribe()
                      router.navigate(['/login']);
                      return throwError(() => err);
                    }),
                    catchError(() => {
                      authService.logout().subscribe()
                      router.navigate(['/login']);
                      return throwError(() => err);
                    })
                  )
              }
              return throwError(() => err);
            })
          )
      }),
    )
}