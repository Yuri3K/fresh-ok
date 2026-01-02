import { inject, Injectable, Injector } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LangsService } from './langs.service';

@Injectable({
  providedIn: 'root',
})
export class LangRouterService {
  private router = inject(Router);
  private injector = inject(Injector);

  get langsService() {
    return this.injector.get(LangsService);
  }

  navigate(urlArr: string[], extras?: NavigationExtras) {
    const normalizedUrlArr = this.addLangInUrlArr(urlArr);
    return this.router.navigate(normalizedUrlArr, extras);
  }

  navigateByUrl(url: string, extras?: NavigationExtras) {
    const normalizedUrl = this.addLangInUrl(url);
    return this.router.navigateByUrl(normalizedUrl, extras);
  }

  // ===================ВНУТРЕННЯЯ ЛОГИКА=========================

  addLangInUrlArr(urlArr: string[]) {
    if (!urlArr.length) return urlArr;

    // Удаляем '/' с первого элемента, если он есть ('/en')
    const firstSegment = this.removeSlash(urlArr[0]);

    // Проверям является ли первый элемент urlArr поддерживаемым языком
    const isLangSupported = this.langsService.isSupported(firstSegment);

    // Если первым элементом в url действительно передали язык и этот
    // язык поддерживается, то просто вернем urlArr
    if (isLangSupported) {
      return urlArr;
    }

    // Если в URL не был указан язык, то
    // 1. Определяем текущий язык
    const lang = this.langsService.resolveInitialLanguage();
    // 2. Извлекаем из длинного названия короткую честь
    const shortLang = lang.split('-')[0]; // 'en-US' --> 'en'
    // 3. Очищаем все элементы urlArr от ненужных '/'
    const clenedUrlArr = urlArr.map((el) => this.removeSlash(el));

    // Возвращаем массив для роутера со вставоенным языком
    return ['/', shortLang, ...clenedUrlArr];
  }

  private addLangInUrl(url: string) {
    // Очищаем строку с URL от '/' и превращаем строку в массив
    const cleanUrlArr = this.removeSlash(url).split('/');
    const firstSegment = cleanUrlArr[0];

    // Проверям является ли первый элемент urlArr поддерживаемым языком
    const isLangSupported = this.langsService.isSupported(firstSegment);

    // Если первым элементом в url действительно передали язык и этот
    // язык поддерживается, то просто вернем url строку
    if (isLangSupported) {
      return '/' + cleanUrlArr.join('/');
    }

    // Если в URL не был указан язык, то
    // 1. Определяем текущий язык
    const lang = this.langsService.resolveInitialLanguage();
    // 2. Извлекаем из длинного названия короткую честь
    const shortLang = lang.split('-')[0]; // 'en-US' --> 'en'

    // Возвращаем url строку со вставленным в нее языком
    return '/' + [shortLang, ...cleanUrlArr].join('/');
  }

  private removeSlash(str: string) {
    return str.startsWith('/') ? str.slice(1) : str;
  }
}
