import { inject, Injectable } from '@angular/core';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { firebaseAuth } from '../firebase.client';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { SnackbarService } from './snackbar.service';
import { UserAccessService } from './user-access.service';
import { AuthRedirectService } from './auth-redirect.service';
import { LangRouterService } from './lang-router.service';
// import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly userAccessService = inject(UserAccessService);
  private readonly authRedirectService = inject(AuthRedirectService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly navigateService = inject(LangRouterService);
  // private readonly translateService = inject(TranslateService)

  private readonly authUserSubject = new BehaviorSubject<
    User | null | undefined
  >(undefined);
  private readonly authInitializingSubject = new BehaviorSubject<boolean>(true);

  // список защищённых префиксов для url, при наличии которых в начале url
  // будет выполнен редирект на страницу /login для неавторизированных пользователей
  // (как правило, это /admin, /user, /profile и т.д.)
  private readonly protectedPrefixes = ['admin', 'user', 'favs'];

  user$ = this.authUserSubject.asObservable();
  authInitializing$ = this.authInitializingSubject.asObservable();

  constructor() {
    // Каждый раз, когда FIREBASE обновляет данные о пользователе, сработает этот метод
    onAuthStateChanged(firebaseAuth, (user) => {
      // Записываем данные про user в authUserSubject
      this.authUserSubject.next(user);

      // Отключаем флаг про выполнении АВТОРИЗАЦИИ
      this.authInitializingSubject.next(false);

      // Если данные про пользователя ЕСТЬ
      if (user) {
        // Вызываем у пользователя встроенный FIREBASE-ом метод.
        // Этот метод возвращает PROMISE в котором передает ТОКЕН пользователя
        user.getIdTokenResult().then((token) => {
          // Из ТОКЕНА вытягиваем ROLE пользователя
          const role = token.claims['role'];

          // Если роль получена
          if (role) {
            // Получаем дополнительные данные про бользователя, записанные в БД.
            // Этот метод запишет полученные данные в отдельный dbUserSubject, который 
            // храниться в userAccessService
            this.userAccessService.fetchDbUser().subscribe({
              error: (err) => {
                this.logout().subscribe(() => {
                  // const errorMessage = this.translateService.instant('errors.fetch-collection-user')
                  // this.snackbarService.openSnackBar(errorMessage)
                });
              },
            });

            return;
          }
        });
      } else {
        // Если пользователь не получен, обнуляем все данные про пользователя
        this.authUserSubject.next(null);
        this.userAccessService.setDbUser(null);
      }
    });
  }

  // Метод для принудительного получения данных про пользователя из Firebase (НЕ из БД)
  private refreshAndFetchUser(
    userCredential: UserCredential
  ): Observable<UserCredential> {
    // Принудительно обновляем ID-токен (чтобы получить актуальные claims)
    return from(userCredential.user.getIdToken(true)).pipe(
      switchMap(() => this.userAccessService.fetchDbUser()),
      // Возвращаем userCredential, чтобы сними можно было продолжать работать в потоке
      map(() => userCredential)
    );
  }

  // Метод для авторизации при помощи email и password
  signInWithEmailAndPassword(
    email: string,
    password: string
  ): Observable<UserCredential> {
    // Применяем метод from из RxJs, чтобы Promise превратить в Observable.
    return from(signInWithEmailAndPassword(firebaseAuth, email, password)).pipe(
      // В userCredential попадает информация, которую хранит FIREBASE про пользователя.
      // Но в userCredential нет информации, которая хранится в БД про пользователя.
      // Поэтому, как только Firebase вернул данные про пользователя, уже можно
      // прикрепить токен к запрсу и получить дополнительные данные с БД про пользователя
      switchMap((userCredential) => this.refreshAndFetchUser(userCredential)),
      // Выполняем переход на страницу для авторизированных пользователей.
      tap(() => this.authRedirectService.navigateAfterLogin()),
      catchError((error) => {
        this.snackbarService.openSnackBar('Invalid email or password');
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  // Метод для авторизации через Google аккаунт
  signInWithGoogle(): Observable<UserCredential | null> {
    const provider = new GoogleAuthProvider();

    // Применяем метод from из RxJs, чтобы Promise превратить в Observable.
    // Вызываем попап от Google для авторизации
    return from(signInWithPopup(firebaseAuth, provider)).pipe(
      // При успешной авторизации, попап от Google вернет userCredential.
      // Сработает onAuthStateChanged, запишет user и токен будет доступен через метод getIdToken.
      // А значит authTokenInterceptor успешно прикрепит ТОКЕН к запросу
      switchMap((userCredential) =>
        this.apiService
          .post<UserCredential>('/register-user/with-google', {})
          .pipe(map(() => userCredential))
      ),
      // Далее принудительно обновляем токен чтобы получить актуальные claims
      // и получить даныые с БД про пользователя
      switchMap((userCredential) => this.refreshAndFetchUser(userCredential)),
      // Выполняем переход на страницу для авторизированных пользователей.
      tap(() => this.authRedirectService.navigateAfterLogin()),
      catchError((err) => {
        console.error('Error registering Google user:', err);
        return of(null);
      })
    );
  }

  // Метод для разлогинивания и принудительного редиректа на страницу /login.
  // redirect по дефолту true, чтобы всегда выполнять редирект на старинцу /login. 
  // Если после разлогинивания нам не нужно перекидывать 
  // пользователя на страницу /login, то передаем redirect = false
  logout(redirect = true): Observable<void> {
    // Применяем метод from из RxJs, чтобы Promise превратить в Observable.
    // Вызываем встроенный метод signOut, чтобы разлогинить пользователя
    return from(signOut(firebaseAuth)).pipe(
      tap(() => {
        this.authUserSubject.next(null);
        this.userAccessService.setDbUser(null);

        // Если редирект включен, то получаем нужные данные для редиректа 
        if (redirect) {
          const currentUrl = this.router.url;
          const segments = currentUrl.split('/').filter(Boolean);
          const firstAfterLang = segments[1];
          const isProtected = this.protectedPrefixes.includes(firstAfterLang);

          // Если редирект включен и мы находимся на защищенном роуте
          // то выполняем редирект на страницу /login
          if (isProtected) {
            this.navigateService.navigate(['/login'], {
              queryParamsHandling: 'merge',
            });
          }
        }
      })
    );
  }

  // Получить текущий idToken для отправки на бэкенд
  getIdToken(forceRefresh = false): Observable<string | null> {
    const user = firebaseAuth.currentUser;
    return user ? from(user.getIdToken(forceRefresh)) : of(null);
  }

  // Быстрая проверка авторизации
  isAuthenticated(): boolean {
    return !!firebaseAuth.currentUser;
  }
}
