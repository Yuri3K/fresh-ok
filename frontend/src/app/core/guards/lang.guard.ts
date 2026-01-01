import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LangsService } from "../services/langs.service";

export const LangGuard: CanActivateFn = (route, state) => {
  console.log("LANG GUARD")
  const langsService = inject(LangsService)
  const router = inject(Router)

  const langParam = route.params['lang'] // берем :lang из URL
  console.log("🔸 langParam:", langParam)

  // Если в URL не указан язык
  if(!langParam) {
    console.log("NO PARAM")
    // Определяем язык автоматически
    const targetLng = langsService.resolveTargetLang() // en, ru, uk
    console.log("🔸 targetLng:", targetLng)
    return router.parseUrl(`/${targetLng}`) // переключаемся на автоматически определенный язык
  }

  // Если я зык в URL был указан, но язык не поддерживается
  if(!langsService.isSupported(langParam)) {
    console.log("NO SUPPORT")
    const fallback = langsService.resolveTargetLang() // пытаемся автоматически определить язык и если не получается, то применим язык для fallback 
    return router.parseUrl(`/${fallback}/404`) // переходим на страницу 404 используя язык, который попал в fallback
  }

  return true
}
