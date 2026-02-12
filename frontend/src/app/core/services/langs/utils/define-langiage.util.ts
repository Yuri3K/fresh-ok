
import { Location } from "@angular/common"
import { getLangFromUrlUtil } from "./get-lang-from-url.util"
import { Lang } from "@shared/models"

// Метод для определения языка. Получает язык из URL, LS, браузера (по приоритету) и проверяет на 
// поддерживаемость. В случае удачи - вернет найденный язык. В ином случае - вернет дефолтный язык
export function defineLanguageUtil(
  langs: Lang[],
  location: Location,
  storedLang: string | null, // передаем из localStorage en-US, ru-RU, uk-UK
  browserLang: string | undefined, // из translateService.getBrowserLang()
  defaultLang: string | null // из translateService.defaultLang
): string {
  let targetLang: string = ''

  // Язык в URL
  const urlLang = getLangFromUrlUtil(langs, location)

  // Проверяем первый язык, который был определен 
  // (по приоритету urlLang ==> stored ==> browserLang)
  if (urlLang) {
    const match = langs.find(l => l.browserLang == urlLang)
    if (match) targetLang = match.name // en-US, ru-RU, uk-UK
  } else if (storedLang && langs.some(l => l.name == storedLang)) {
    targetLang = storedLang // en-US, ru-RU, uk-UK
  } else {
    const match = langs.find(l => l.browserLang == browserLang)
    if (match) targetLang = match.name // en-US, ru-RU, uk-UK
  }

  // Если ничего не найдено, то возвращаем значение по умолчанию
  if (!targetLang) {
    targetLang = defaultLang || 'en-US'
  }

  return targetLang // en-US, ru-RU, uk-UK
}