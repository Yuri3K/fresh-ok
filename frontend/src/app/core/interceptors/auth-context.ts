import { HttpContextToken } from "@angular/common/http";

// Применяется в APISERVICE, когда нужно в запросе на сервер указать нужно 
// ли в запрос включать ТОКЕН. На этот SKIP_AUTH отреагирует authTokenInterceptor
// и далее выполнит запрос с добавлением ТОКЕНА или без него
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false)