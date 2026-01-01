import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
  private router = inject(Router)

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
    console.log('init')
    return this.apiService.getWithoutToken<Lang[]>('/langs') // получаем языки с сервера
      .pipe(
        take(1),
        switchMap(langs => {
          this.setLangs(langs) // записываем полученные языки с сервера в langsSubject
          const langToUse = this.resolveInitialLanguage(langs) // en-US, ru-RU, uk-UK

          return this.translateService.use(langToUse) // метод use в ngx-translate - это тоже Observable
            .pipe(
              map(() => {
                const langData = langs.find(l => l.name === langToUse);
                if (langData) {
                  this.setCurrentLang(langData); // записываем объект данных текущего языка в currentLangSubject
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

  private getLangFromUrl(langs: Lang[]) {
    // получит из url первый сегмент, например /home, елси в url язык не передан или /en, если я зык передан
    const firstSegment = this.location.path().split('/')[1]

    // Проверит совпадает ли сегмент с языками, которые доступны. Если да, то вернет название языка (en, ru, uk), если нет, то вернет null
    return langs.some(l => l.browserLang === firstSegment) ? firstSegment : null;
  }

  // Используется при смене языка в языковом дропдауне
  setLanguage(lang: Lang) {
    // this.translateService.use(lang.name) // en-US, ru-RU, uk-UK
    // this.setCurrentLang(lang) // объект с данными про выбранный язык
    // localStorage.setItem(environment.lsLangKey, lang.name) // записываем в LS en-US / ru-RU / uk-UK

    const currentUrl = this.location.path();  // /en/home
    const segments = currentUrl.split('/'); // ['', 'en', 'home']

    // Заменяем сегмент языка: /en/home -> /ru/home
    segments[1] = lang.browserLang;

    this.translateService.use(lang.name) // en-US, ru-RU, uk-UK
      .pipe(take(1))
      .subscribe(() => {
        this.setCurrentLang(lang); // сохраняем объект с данными про выбранный язык в currentLangSubject
        localStorage.setItem(environment.lsLangKey, lang.name); // записываем в LS en-US / ru-RU / uk-UK
        this.router.navigateByUrl(segments.join('/')); // переходим по новому URL
      });
  }

  private setCurrentLang(lang: Lang) {
    this.currentLangSubject.next(lang) // lang - объект с данными про выбранный язык
  }

  private resolveInitialLanguage(langs: Lang[]): string {
    let targetLang: string = ''

    // Язык в URL
    const urlLang = this.getLangFromUrl(langs)

    // Язык из localStorage
    const stored = localStorage.getItem(environment.lsLangKey) // en-US, ru-RU, uk-UK

    // Язык браузера
    const browserLang = this.translateService.getBrowserLang()

    // Проверяем первый язык, который был определен 
    // (по приоритету urlLang ==> stored ==> browserLang)
    if (urlLang) {
      const match = langs.find(l => l.browserLang == urlLang)
      if (match) targetLang = match.name // en-US, ru-RU, uk-UK
    } else if (stored && langs.some(l => l.name == stored)) {
      targetLang = stored // en-US, ru-RU, uk-UK
    } else {
      const match = langs.find(l => l.browserLang == browserLang)
      if (match) targetLang = match.name // en-US, ru-RU, uk-UK
    }

    // Если ничего не найдено, то возвращаем значение по умолчанию
    if (!targetLang) {
      targetLang = this.translateService.defaultLang || 'en-US'
    }

    // Назначаем currentLang
    const langData = this.langs.find(l => l.name == targetLang)

    if (langData) {
      this.setCurrentLang(langData)
      // this.setLanguage(langData)
    }

    console.log('targetLang', targetLang)
    return targetLang // en-US, ru-RU, uk-UK
  }

  // Если в URL не будет указан язык, LangGuard будет запрашивать опредилить язык автоматически
  resolveTargetLang() {
    // Проверяем в LS наличие данных о примененном языке
    const stored = localStorage.getItem(environment.lsLangKey)

    // Проверяем какой язык использует браузер пользователя
    const browser = this.translateService.getBrowserLang() // en, ru, uk

    if (stored) {
      const match = this.langs.find(l => l.name === stored)

      if (match) return match.browserLang
    } else {
      //Проверяем поддерживаем ли мы язык, который используется в браузере пользоватуля
      if (browser && this.isSupported(browser)) return browser;
    }

    return 'en'; // fallback
  }

  // LangGuard будет запрашивать подтверждение на возможность применения языка, который указали в URL
  isSupported(shortCode: string): boolean {
    // Проверка, есть ли такой код в списке от бэкенда
    return this.langs.some(l => l.browserLang === shortCode);
  }
}
