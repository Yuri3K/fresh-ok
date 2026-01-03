import { inject, Injectable, Injector } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LangsService } from './langs.service';

@Injectable({
  providedIn: 'root',
})

// Данный сервис используется для добавления используемого языка в URL
export class LangRouterService {
  private router = inject(Router);

  // здесь применяется Injector в связи с тем, что при старте приложения если
  // сразу импортировать LangsService, то это вызовет circular DI. А с применением 
  // Injector мы будем через get langsService() получать данные из LangsService только
  // тогда, когда в этом будет необходимость
  private injector = inject(Injector);

  // Инжектим LangsService не при старте приложения, а только тогда, 
  // когда нужно получить данные из LangsService
  get langsService() {
    return this.injector.get(LangsService);
  }

  // Выполнит переход по переданному URL, используя метод router.navigate 
  // но предварительно добавит в URL язык
  navigate(urlArr: string[], extras?: NavigationExtras) {
    const normalizedUrlArr = this.addLangInUrlArr(urlArr);
    return this.router.navigate(normalizedUrlArr, extras);
  }

  // Выполнит переход по переданному URL, используя метод router.navigateByUrl 
  // но предварительно добавит в URL язык
  navigateByUrl(url: string, extras?: NavigationExtras) {
    const normalizedUrl = this.addLangInUrl(url);
    return this.router.navigateByUrl(normalizedUrl, extras);
  }

  // ===================ВНУТРЕННЯЯ ЛОГИКА=========================

  // Метод для добавления языка в массив URL
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

  // Метод для добавления языка в URL строку
  addLangInUrl(url: string) {
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
