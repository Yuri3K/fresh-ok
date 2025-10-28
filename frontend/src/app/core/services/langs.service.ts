import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
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

  init() {
    this.getLangsFromDb().subscribe()
  }

  get langs(): Lang[] {
    return this.langsSubject.getValue()
  }

  private setLangs(langs: Lang[]) {
    console.log("🔸 langs:", langs)
    this.langsSubject.next(langs)
  }

  private getLangsFromDb(): Observable<Lang[]> {
    if (this.langs.length) {
      return of(this.langs)
    } else {
      return this.apiService.getWithoutToken<Lang[]>('/langs')
        .pipe(
          tap(langs => {
            this.setInitialLanguage(langs)
            this.setLangs(langs)
          }),
        )
    }
  }

  private setInitialLanguage(langs: Lang[]) {
    const browserLang = this.translateService.getBrowserLang();

    const matchedLang = langs.find(lang => lang.browserLang === browserLang);

    const langToUse =
      matchedLang?.name ??
      this.translateService.currentLang ??
      this.translateService.defaultLang ??
      'en-US';

    console.log("🔸 langToUse:", langToUse)
    this.translateService.use(langToUse);
  }
}
