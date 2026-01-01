import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LangsService } from "../services/langs.service";

export const LangGuard: CanActivateFn = (route, state) => {
  const langsService = inject(LangsService)
  const router = inject(Router)

  const langParam = route.params['lang'] // берем :lang из URL

  if(!langParam) {
    const targetLng = langsService.resolveTargetLang()
    return router.parseUrl(`/${targetLng}`)
  }

  if(!langsService.isSupported(langParam)) {
    const fallback = langsService.resolveTargetLang()
    return router.parseUrl(`/${fallback}/404`)
  }

  return true
}