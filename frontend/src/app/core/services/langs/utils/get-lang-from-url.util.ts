import { Lang } from "../langs.service";
import { Location } from '@angular/common';

// Получаем язык из URL, если он там есть
export function getLangFromUrlUtil(langs: Lang[], location: Location) {
  // получит из url первый сегмент, например /home, если в url язык не передан или /en, если язык передан
  const firstSegment = location.path().split('/')[1]

  // Проверит совпадает ли сегмент с языками, которые доступны. Если да, то вернет название языка (en, ru, uk), если нет, то вернет null
  return langs.some(l => l.browserLang === firstSegment) ? firstSegment : null;
}