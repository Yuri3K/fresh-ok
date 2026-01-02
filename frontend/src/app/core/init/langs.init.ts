import { inject } from "@angular/core";
import { LangsService } from "../services/langs.service";

// Применяется в app.config.ts в APP_INITIALIZER. 
// Используется для того, чтобы дождаться, пока будут получены доступные языки с сервера 
// и только потом запустит приложение. Если запускать получение языков в app.component.ts, 
// а не в APP_INITIALIZER, то LangGuard при запросе resolveTargetLang всегда 
// будет получать язык, который определен как fallback, так как массива с языками 
// еще не будет.
export function initLangsFactory() {
  const langsService = inject(LangsService)
  // Возвращает функцию, которая возвращает Promise (или Observable). 
  // Angular будет ждать пока не выполнится эта функция.
  return langsService.init()
}