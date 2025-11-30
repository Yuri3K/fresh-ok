import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, take, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';

export type LangCode = 'en' | 'ru' | 'uk';
export interface Lang {
  id: string;
  name: string;        // e.g. "en-US", "ru-RU"
  browserLang: LangCode; // e.g. "en", "ru"
}

@Injectable({
  providedIn: 'root'
})
export class LangsService {
  private readonly apiService = inject(ApiService)
  private readonly translateService = inject(TranslateService)
  private location = inject(Location)

  private readonly langsSubject = new BehaviorSubject<Lang[]>([])
  private readonly currentLangSubject = new BehaviorSubject<Lang | null>(null)

  langs$ = this.langsSubject.asObservable()
  currentLang$ = this.currentLangSubject.asObservable()

  get langs(): Lang[] {
    return this.langsSubject.getValue()
  }

  /**
 * init() - вызывается в app.component.
 * загружает языки через API бэкенда, 
 * определяет стартовый язык и выполняет translate.use(...).
 */
  init(): Observable<unknown> {
    return this.apiService.getWithoutToken<Lang[]>('/langs')
      .pipe(
        take(1),
        switchMap(langs => {
          this.setLangs(langs)
          const langToUse = this.resolveInitialLanguage(langs)
          return this.translateService.use(langToUse)
            .pipe(
              map(() => {
                const langData = langs.find(l => l.name === langToUse);
                if (langData) {
                  this.setCurrentLang(langData);
                }
              })
            )
        }),
        catchError(err => {
          console.log('[LangsService] init error:', err)
          const fallback = this.translateService.getFallbackLang() || 'en-US'
          return this.translateService.use(fallback)
            .pipe(catchError((error) => {
              return throwError(() => error)
            }))
        }),
      )
  }

  private setLangs(langs: Lang[]) {
    this.langsSubject.next(langs)
  }

  private getLangFromUrl() {
    const firstSegment = this.location.path().split('/')[1]
    return firstSegment?.length === 2 ? firstSegment : null;
  }

  setLanguage(lang: Lang) {
    this.translateService.use(lang.name)
    this.setCurrentLang(lang)
    localStorage.setItem(environment.lsLangKey, lang.name)
  }

  private setCurrentLang(lang: Lang) {
    this.currentLangSubject.next(lang)
  }

  private resolveInitialLanguage(langs: Lang[]): string {
    let targetLang: string = ''

    // Язык в URL
    const urlLang = this.getLangFromUrl()
    if (urlLang && langs.some(l => l.name == urlLang)) {
      targetLang = urlLang
    }

    // Язык из localStorage
    const stored = localStorage.getItem(environment.lsLangKey)
    if (stored && langs.some(l => l.name == stored)) {
      targetLang = stored
    }

    // Язык браузера
    const browserLang = this.translateService.getBrowserLang()
    const match = langs.find(l => l.browserLang == browserLang)
    if (match) targetLang = match.name

    // Если ничего не найдено, то возвращаем значение по умолчанию
    if (!targetLang) {
      targetLang = this.translateService.defaultLang || 'en-US'
    }

    // Назначаем currentLang
    const langData = this.langs.find(l => l.name == targetLang)

    if (langData) {
      this.setCurrentLang(langData)
    }

    return targetLang
  }
}
