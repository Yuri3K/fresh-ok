import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { SKIP_AUTH } from './auth-context';

/**
 * Этот Interceptor срабатывает когда APISERVICE выполняет переход на внешние 
 * ссылки (обращается к серверу). Добавит ТОКЕН к запросу в случае, если URL
 * начинается на environment.serverUrl. НЕ добавит токен, если APISERVICE
 * в запросе прикрепит SKIP_AUTH = true.
 *
 */
export const authTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService)


  // Если запрашиваемый URL НЕ начинается на environment.serverUrl
  // или если APISERVICE в запросе прикрепил SKIP_AUTH = true
  if (
    !req.url.startsWith(environment.serverUrl) ||
    req.context.get(SKIP_AUTH)
  ) {
    // Просто выполняем запрос без добавления ТОКЕНА
    // Метод next - это внутрениий метод Interceptor-а, который прокидывает запрос дальше
    return next(req);
  }

  // Если верхний IF не сработал, то получаем токен из authService. 
  // Передаем false, так как обновление токета тут не требуется
  return authService.getIdToken(false).pipe(
    switchMap((token) => {
      // Если ТОКЕН есть, то добавляем его в headers запроса
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      // Прокидываем запрос дальше и передав в него обновленный req.
      // Отслеживаем ошибки
      return next(authReq).pipe(
        catchError((err: unknown) => {
          const httpErr = err as HttpErrorResponse;
          // Если пользователь не авторизирован (401), то возможно к него 
          // устарел ТОКЕН. Поэтому вызываем еще раз authService.getIdToken
          // и передаем true, чтобы обновить токен.
          if (httpErr.status === 401) {
            return authService.getIdToken(true).pipe(
              switchMap((newToken) => {
                if (newToken) {
                  const retried = req.clone({
                    setHeaders: { Authorization: `Bearer ${newToken}` },
                  });
                  return next(retried);
                }
                authService.logout().subscribe();
                return throwError(() => err);
              }),
              // Если повторный запрос с обновленным токеном вернул ошибку, то
              // возвращаем ошибку
              catchError(() => {
                authService.logout().subscribe();
                return throwError(() => err);
              })
            );
          }
          // Если первый запрос вернул ошибку (не 401), то возвращаем ошибку
          return throwError(() => err);
        })
      );
    })
  );
};
