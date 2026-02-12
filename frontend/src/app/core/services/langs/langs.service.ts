import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, take, throwError } from 'rxjs';
import { ApiService } from '../api.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { defineLanguageUtil } from './utils/define-langiage.util';
import { RestoreScrollService } from '../restore-scroll.service';
import { Lang } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class LangsService {
  private readonly apiService = inject(ApiService)
  private readonly translateService = inject(TranslateService)
  private location = inject(Location)
  private router = inject(Router)
  private restoreScrollService = inject(RestoreScrollService)

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
    // console.log('init')
    return this.apiService.getWithoutToken<Lang[]>('/langs') // получаем языки с сервера
      .pipe(
        take(1),
        switchMap(langs => {
          this.setLangs(langs) // записываем полученные языки с сервера в langsSubject

          // Определяем какой язык использовать
          const langToUse = this.resolveInitialLanguage() // en-US, ru-RU, uk-UK
          // Назначаем currentLang
          const langData = langs.find(l => l.name == langToUse)

          if (langData) {
            this.setCurrentLang(langData)
          }

          // Передаем в translateService язык
          return this.translateService.use(langToUse) // метод use в ngx-translate - это тоже Observable
            .pipe(
              map(() => {
                // Находим среди языков, полученных с сервера, данные про выбранный язык
                const langData = langs.find(l => l.name === langToUse);

                if (langData) {

                  // записываем объект данных текущего языка в currentLangSubject
                  this.setCurrentLang(langData);

                  // записываем язык в LS
                  localStorage.setItem(environment.lsLangKey, langData.name)
                }
              })
            )
        }),
        // Отслеживаем ошибки при получении языков с сервера
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

  // Записываем массив доступных языков в langsSubject
  private setLangs(langs: Lang[]) {
    this.langsSubject.next(langs)
  }

  // Переключаем язык. Используется при смене языка в языковом дропдауне
  setLanguage(lang: Lang) {
    const currentUrl = this.location.path();  // /en/home
    const segments = currentUrl.split('/').filter(Boolean); // ['', 'en', 'home'] --> ['en', 'home']

    // Заменяем сегмент языка: /en/home -> /ru/home
    segments[0] = lang.browserLang;

    this.translateService.use(lang.name) // en-US, ru-RU, uk-UK
      .pipe(take(1))
      .subscribe(() => {
        this.setCurrentLang(lang); // сохраняем объект с данными про выбранный язык в currentLangSubject
        localStorage.setItem(environment.lsLangKey, lang.name); // записываем в LS en-US / ru-RU / uk-UK

        // Переходим по новому URL
        this.router.navigateByUrl(segments.join('/'), {
          skipLocationChange: false,
          replaceUrl: true
        }).then(() => this.restoreScrollService.restoreScroll());
      });
  }

  // Записываем объект данных про текуций язык в currentLangSubject
  private setCurrentLang(lang: Lang) {
    this.currentLangSubject.next(lang) // lang - объект с данными про выбранный язык
  }

  // Метод для определения языка. Получает язык из URL, LS, браузера (по приоритету) и проверяет на 
  // поддерживаемость. В случае удачи - вернет найденный язык. В ином случае - вернет дефолтный язык
  resolveInitialLanguage(): string {
    const storedLang = localStorage.getItem(environment.lsLangKey);
    const browserLang = this.translateService.getBrowserLang();
    const defaultLang = this.translateService.defaultLang;

    const targetLang = defineLanguageUtil(
      this.langs,
      this.location,
      storedLang,
      browserLang,
      defaultLang
    )

    // Назначаем currentLang
    const langData = this.langs.find(l => l.name == targetLang)

    if (langData) {
      this.setCurrentLang(langData)
    }

    return targetLang // en-US, ru-RU, uk-UK
  }

  // Используется для получения языка в сокращенном виде.
  // Применяется в случае если в URL не будет указан язык, LangGuard будет запрашивать опредилить язык автоматически
  resolveTargetLang() {
    // Проверяет сохранен ли уже язык
    const current = this.currentLangSubject.getValue();
    if (current) {
      return current.browserLang;
    }

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

    return this.translateService.defaultLang?.split('-')[0] || 'en'; // fallback
  }

  // LangGuard и LangRouterService будет запрашивать подтверждение на возможность применения языка, который указали в URL
  isSupported(shortCode: string): boolean {
    // Проверка, есть ли такой код в списке от бэкенда
    return this.langs.some(l => l.browserLang === shortCode);
  }
}
