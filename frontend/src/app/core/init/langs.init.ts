import { inject } from "@angular/core";
import { LangsService } from "../services/langs.service";

export function initLangsFactory() {
  const langsService = inject(LangsService)
  // Возвращает функцию, которая возвращает Promise (или Observable). 
  // Angular будет ждать пока не выполнится эта функция.
  return langsService.init()
}