import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { LangCode } from "../services/langs.service";

/**
 * Interceptor добавляет заголовок Accept-Language ко всем запросам на сервер.
 * Читает язык напрямую из localStorage, чтобы избежать циклической зависимости.
 */
export const langInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const lang = defineLang()

  if (!req.url.startsWith(environment.serverUrl)) {
    return next(req)
  }

  // Клонируем запрос и добавляем заголовок с языком
  const langReq = req.clone({
    setHeaders: {
      'Accept-Language': lang,
    }
  })

  return next(langReq)
}

function defineLang() {
  const stored = localStorage.getItem(environment.lsLangKey)

  if (stored) {
    // Извлекаем короткий код (en, ru, uk) из полного (en-US, ru-RU, uk-UK)
    const shortLang = stored.split('-')[0].toLowerCase() as LangCode;

    if (['en', 'ru', 'uk'].includes(shortLang)) {
      return shortLang;
    }
  }

  // Fallback: пробуем определить язык браузера
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  if (['en', 'ru', 'uk'].includes(browserLang)) {
    return browserLang as LangCode;
  }

  // Если ничего не найдено - возвращаем дефолтный
  return 'en';
}