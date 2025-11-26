import { inject, Injectable } from '@angular/core';
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from 'firebase/auth';
import { BehaviorSubject, catchError, delay, from, map, Observable, of, retry, switchMap, tap, throwError } from 'rxjs';
import { firebaseAuth } from '../firebase.client';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { SnackbarService } from './snackbar.service';
import { UserAccessService } from './user-access.service';
import { AuthRedirectService } from './auth-redirect.service';
// import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router)
  private readonly apiService = inject(ApiService)
  private readonly userAccessService = inject(UserAccessService)
  private readonly authRedirectService = inject(AuthRedirectService)
  private readonly snackbarService = inject(SnackbarService)
  // private readonly translateService = inject(TranslateService)

  private readonly authUserSubject = new BehaviorSubject<User | null | undefined>(undefined)
  private readonly authInitializingSubject = new BehaviorSubject<boolean>(true)

  // список защищённых префиксов для url, при наличии которых в начале url
  // будет выполнен редирект на страницу /login для неавторизированных пользователей 
  // (как правило, это /admin, /user, /profile и т.д.)
  private readonly protectedPrefixes = ['/admin', '/user', '/favs']

  user$ = this.authUserSubject.asObservable()
  authInitializing$ = this.authInitializingSubject.asObservable()

  constructor() {
    onAuthStateChanged(firebaseAuth, user => {
      console.log("🔸 STATE CHANGED:", user)

      this.authUserSubject.next(user)
      this.authInitializingSubject.next(false)

      if (user) {
        user.getIdTokenResult().then(token => {
          const role = token.claims['role']
          console.log("ROLE IN USER", role)

          if (role) {
            this.userAccessService.fetchDbUser().subscribe({
              error: (err) => {
                this.logout().subscribe(() => {
                  // const errorMessage = this.translateService.instant('errors.fetch-collection-user')
                  // this.snackbarService.openSnackBar(errorMessage)
                })
              }
            })

            return
          }
        })
      } else {
        this.authUserSubject.next(null)
        this.userAccessService.setDbUser(null);
      }
    })
  }

  private refreshAndFetchUser(userCredential: UserCredential): Observable<UserCredential> {
    // Принудительно обновляем ID-токен (чтобы получить актуальные claims)
    return from(userCredential.user.getIdToken(true))
      .pipe(
        tap(() => console.log("!!! REFRESH TOKEN  !!!")),
        switchMap(() => this.waitForClaims(userCredential.user)),
        switchMap(() => this.userAccessService.fetchDbUser()),
        // Возвращаем userCredential, чтобы сними можно было рподолжать работать в потоке
        map(() => userCredential)
      )
  }

  private waitForClaims(user: User): Observable<void> {
    return from(user.getIdTokenResult(true)).pipe(
      switchMap(tokenResult => {
        console.log("🔸 tokenResult.claims?.['role']:", tokenResult.claims?.['role'])
        if (tokenResult.claims?.['role']) {
          // role уже доступна — идем дальше
          return of(void 0);
        }
        // Иначе ждём и повторяем
        return throwError(() => new Error("No role yet"));
      }),
      retry({
        count: 10,          // до 10 попыток
        delay: 300          // каждые 300 мс
      })
    );
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(firebaseAuth, email, password))
      .pipe(
        switchMap(userCredential => this.refreshAndFetchUser(userCredential)),
        tap(() => this.authRedirectService.navigateAfterLogin()),
        catchError(error => {
          this.snackbarService.openSnackBar('Invalid email or password')
          console.error('Login error:', error);
          throw error;
        })
      )
  }

  signInWithGoogle(): Observable<UserCredential | null> {
    const provider = new GoogleAuthProvider()

    return from(signInWithPopup(firebaseAuth, provider))
      .pipe(
        switchMap((userCredential) =>{
          console.log("STARTING CALL with-google")
          return this.apiService.post<UserCredential>('/register-user/with-google', {})
            .pipe(map(() => userCredential))
        }),
        switchMap(userCredential => this.refreshAndFetchUser(userCredential)),
        tap(() => this.authRedirectService.navigateAfterLogin()),
        catchError(err => {
          console.error('Error registering Google user:', err);
          return of(null)
        })
      )
  }

  // Метод для выхода
  logout(redirect = true): Observable<void> {
    return from(signOut(firebaseAuth))
      .pipe(
        tap(() => {
          this.authUserSubject.next(null)
          this.userAccessService.setDbUser(null);

          if (redirect) {
            const currentUrl = this.router.url
            const isProtected = this.protectedPrefixes.some(p => currentUrl.startsWith(p))

            if (isProtected) {
              this.router.navigate(['/login'])
            }
          }
        })
      )
  }

  // Получить текущий idToken для отправки на бэкенд
  getIdToken(forceRefresh = false): Observable<string | null> {
    const user = firebaseAuth.currentUser
    return user ? from(user.getIdToken(forceRefresh)) : of(null)
  }

  // Быстрая проверка авторизации
  isAuthenticated(): boolean {
    return !!firebaseAuth.currentUser
  }
}
