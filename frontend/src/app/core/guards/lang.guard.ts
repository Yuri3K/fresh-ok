import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { LangsService } from "../services/langs.service";

export const LangGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  console.log("🔸 !!!LangGuard!!!:", )

  const langsService = inject(LangsService)
  const router = inject(Router)

  const langParam = route.params['lang'] // берем :lang из URL
  console.log("🔸 langParam:", langParam)

  // Если в URL не указан язык
  if (!langParam) {
    // Определяем язык автоматически
    const targetLng = langsService.resolveTargetLang() // en, ru, uk
    return router.parseUrl(`/${targetLng}${state.url}`) // переключаемся на автоматически определенный язык
  }

  // Если я зык в URL был указан, но язык не поддерживается
  if(!langsService.isSupported(langParam)) {
    const fallback = langsService.resolveTargetLang() // пытаемся автоматически определить язык и если не получается, то применим язык для fallback 
    return router.parseUrl(`/${fallback}${state.url}`) // переходим на страницу используя язык, который попал в fallback
  }
  console.log("!!! LAST !!!")

  return true
}
