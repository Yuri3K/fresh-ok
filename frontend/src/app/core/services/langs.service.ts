import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';

export interface Lang {
  id: string
  name: string
  browserLang: string
}

@Injectable({
  providedIn: 'root'
})
export class LangsService {
  private readonly apiService = inject(ApiService)
  private readonly translateService = inject(TranslateService)
  private location = inject(Location)

  private readonly langsSubject = new BehaviorSubject<Lang[]>([])
  langs$ = this.langsSubject.asObservable()

  get langs(): Lang[] {
    return this.langsSubject.getValue()
  }

  async init() {
    // this.getLangsFromDb().subscribe()
    const langs = await firstValueFrom(this.apiService.getWithoutToken<Lang[]>('/langs'))
    console.log("🚀 ~ langs:", langs)
    this.setLangs(langs)

    const langToUse = this.resolveInitialLanguage(langs)
    this.translateService.use(langToUse)
  }

  private setLangs(langs: Lang[]) {
    this.langsSubject.next(langs)
  }

  private getLangFromUrl() {
    const firstSegment = this.location.path().split('/')[1]
    return firstSegment?.length === 2 ? firstSegment : null;
  }

  setLanguage(lang: string) {
    this.translateService.use(lang)
    localStorage.setItem(environment.lsLangKey, lang)
  }

  private resolveInitialLanguage(langs: Lang[]): string {

    // Язык в URL
    const urlLang = this.getLangFromUrl()
    if(urlLang && langs.some(l => l.name == urlLang)) {
      return urlLang
    }

    // Язык из localStorage
    const stored = localStorage.getItem(environment.lsLangKey)
    if(stored && langs.some(l => l.name == stored)) {
      return stored
    }

    // Язык браузера
    const browserLang = this.translateService.getBrowserLang()
    const match = langs.find(l => l.browserLang == browserLang)
    if(match) return match.name

    // Если ничего не найдено, то возвращаем значение по умолчанию
    return this.translateService.defaultLang || 'en'
  }

  // private getLangsFromDb(): Observable<Lang[]> {
  //   if (this.langs.length) {
  //     return of(this.langs)
  //   } else {
  //     return this.apiService.getWithoutToken<Lang[]>('/langs')
  //       .pipe(
  //         tap(langs => {
  //           this.setInitialLanguage(langs)
  //           this.setLangs(langs)
  //         }),
  //       )
  //   }
  // }

  private setInitialLanguage(langs: Lang[]) {
    const browserLang = this.translateService.getBrowserLang();

    const matchedLang = langs.find(lang => lang.browserLang === browserLang);

    const langToUse =
      matchedLang?.name ??
      this.translateService.currentLang ??
      this.translateService.defaultLang ??
      'en-US';

    this.translateService.use(langToUse);
  }
}
