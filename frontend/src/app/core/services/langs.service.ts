import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TranslateService } from '@ngx-translate/core';

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

  private readonly langsSubject = new BehaviorSubject<Lang[]>([])
  langs$ = this.langsSubject.asObservable()

  constructor() {
    this.getLangsFromDb().subscribe()
  }

  get langs(): Lang[] {
    return this.langsSubject.getValue()
  }

  private setLangs(langs: Lang[]) {
    this.langsSubject.next(langs)
  }

  private getLangsFromDb(): Observable<Lang[]> {
    if (this.langs.length) {
      return of(this.langs)
    } else {
      return this.apiService.getWithoutToken<Lang[]>('/langs')
        .pipe(
          tap(langs => {
            this.setLangs(langs)
            const langsMap = new Map()
            langs.forEach(lang => langsMap.set(lang.browserLang, lang.name))
            const browserLang = this.translateService.getBrowserLang()
            const existingLang = langsMap.get(browserLang) ?? 'en-US'
            this.translateService.use(existingLang)
          }),
        )
    }
  }
}
