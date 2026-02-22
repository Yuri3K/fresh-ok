export type LangCode = 'en' | 'ru' | 'uk';

export interface Lang {
  id: string;
  name: string;        // e.g. "en-US", "ru-RU"
  browserLang: LangCode; // e.g. "en", "ru",
  order: number;
  locale: string; // e.g. "en-US", "ru-RU", "uk-UA"
}