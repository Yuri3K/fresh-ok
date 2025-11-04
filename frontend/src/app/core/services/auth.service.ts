import { inject, Injectable } from '@angular/core';
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from 'firebase/auth';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { firebaseAuth } from '../firebase.client';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { SnackbarService } from './snackbar.service';
import { environment } from '../../../environments/environment';
// import { TranslateService } from '@ngx-translate/core';

export interface dbUser {
  uid: string
  email: string
  displayName: string
  role: string
  permissions: string[]
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router)
  private readonly apiService = inject(ApiService)
  private readonly snackbarService = inject(SnackbarService)
  // private readonly translateService = inject(TranslateService)

  private readonly authUserSubject = new BehaviorSubject<User | null | undefined>(undefined)
  private readonly dbUserSubject = new BehaviorSubject<dbUser | null>(null)
  private readonly authInitializingSubject = new BehaviorSubject<boolean>(true)

  // список защищённых префиксов в url, при наличии которых будет выполнен редирект 
  // на страницу /login для неавторизированных пользователей 
  // (как правило, это /admin, /user, /profile и т.д.)
  private readonly protectedPrefixes = ['/admin', '/user', '/favs']

  user$ = this.authUserSubject.asObservable()
  role$ = this.dbUserSubject.pipe(map(u => u?.role || null))
  permissions$ = this.dbUserSubject.pipe(map(u => u?.permissions || null))
  authInitializing$ = this.authInitializingSubject.asObservable()

  constructor() {
    onAuthStateChanged(firebaseAuth, user => {
      console.log("🔸 user:", user)

      this.authUserSubject.next(user)
      this.authInitializingSubject.next(false)

      if (user) {
        this.fetchDbUser().subscribe({
          error: (err) => {
            this.logout().subscribe(() => {
              // const errorMessage = this.translateService.instant('errors.fetch-collection-user')
              // this.snackbarService.openSnackBar(errorMessage)
            })
          }
        })
      } else {
        this.authUserSubject.next(null)
        this.dbUserSubject.next(null);
      }
    })
  }
  
  private navigateAfterLogin() {
    const lsKey = environment.lsSavedUrlKey
    const savedUrl = localStorage.getItem(lsKey)
    if(savedUrl) {
      // Если не авторизированный пользователь пытался перейти на защищенный роут
      // то его запрошенный url будет сохранен в Local Storage (authGuard), а сам пользователь
      // будет переведен на страницу /login, и после успешной авторизации, будет
      // переведен на сохраненный URL
      this.router.navigateByUrl(savedUrl)
      localStorage.removeItem(lsKey)
    } else {
      // Если сохраненного URL нет — переходим на /home
      this.router.navigate(['/home'])
    }
  } 

  private refreshAndFetchUser(userCredential: UserCredential): Observable<UserCredential> {
    // Принудительно обновляем ID-токен (чтобы получить актуальные claims)
    return from(userCredential.user.getIdToken(true))
      .pipe(
        switchMap(() => this.fetchDbUser()),
        map(() => userCredential)
      )
  }

  private fetchDbUser(): Observable<dbUser> {
    return this.apiService.get<dbUser>('/users/me')
      .pipe(
        tap((user => this.dbUserSubject.next(user)))
      )
  }

  /**
   * Проверка роли пользователя
   */
  hasRole(roles: string[]): boolean {
    const user = this.dbUserSubject.getValue()

    if (!user || !user.role) {
      this.logout().subscribe()
      return false
    }

    // если роли не переданы — доступ открыт
    if (!roles || roles.length === 0) {
      return true
    }

    return roles.includes(user.role)
  }

  /**
   * Проверка разрешений пользователя
   * @param permissionsRequired — массив разрешений для проверки
   * @param mode — 'any' (хватает одного) или 'all' (нужны все); по умолчанию 'any'
   */
  hasPermission(permissionsRequired: string[], permissionsMode: 'all' | 'any' = 'any'): boolean {
    const user = this.dbUserSubject.getValue()

    if (!user) {
      this.logout().subscribe()
      return false
    }

    const userPermissions = user.permissions ?? []

    // если доступы не переданы — доступ открыт
    if (!permissionsRequired || permissionsRequired.length == 0) {
      return true
    }

    if (permissionsMode === 'all') {
      return permissionsRequired.every(p => userPermissions.includes(p))
    } else {
      return permissionsRequired.some(p => userPermissions.includes(p))
    }
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(firebaseAuth, email, password))
      .pipe(
        switchMap(userCredential => this.refreshAndFetchUser(userCredential)),
        tap(() => this.navigateAfterLogin()),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      )
  }

  signInWithGoogle(): Observable<UserCredential | null> {
    const provider = new GoogleAuthProvider()

    return from(signInWithPopup(firebaseAuth, provider))
      .pipe(
        switchMap((userCredential) =>
          this.apiService.post<UserCredential>('/register-user/with-google', {})
            .pipe(map(() => userCredential))
        ),
        switchMap(userCredential => this.refreshAndFetchUser(userCredential)),
        tap(() => this.navigateAfterLogin()),
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
          this.dbUserSubject.next(null)

          if(redirect) {
            const currentUrl = this.router.url
            const isProtected = this.protectedPrefixes.some(p => currentUrl.startsWith(p))

            if(isProtected) {
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
