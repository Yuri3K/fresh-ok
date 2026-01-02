import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthService } from "../services/auth.service";
import { SKIP_AUTH } from "./auth-context";

export const authTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService)
  const injector = inject(Injector)

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
                      return throwError(() => err);
                    }),
                    catchError(() => {
                      authService.logout().subscribe()
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