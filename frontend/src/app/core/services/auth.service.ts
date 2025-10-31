import { inject, Injectable } from '@angular/core';
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from 'firebase/auth';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { firebaseAuth } from '../firebase.client';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { SnackbarService } from './snackbar.service';
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

  user$ = this.authUserSubject.asObservable()
  role$ = this.dbUserSubject.pipe(map(u => u?.role || null))
  permissions$ = this.dbUserSubject.pipe(map(u => u?.permissions || null))
  authInitializing$ = this.authInitializingSubject.asObservable()

  constructor() {
    onAuthStateChanged(firebaseAuth, user => {
      console.log("🔸 user:", user)

      this.authUserSubject.next(user)
      this.authInitializingSubject.next(false)

      const currentUrl = this.router.url;

      // if (user) {
      //   this.fetchDbUser()
      //     .subscribe(() => {
      //       if (currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/') {
      //         this.router.navigate(['/home']);
      //       }
      //     })
      // } else {
      //   this.router.navigate(['/login']);
      // }
    })
  }

  private fetchDbUser(): Observable<dbUser> {
    return this.apiService.get<dbUser>('/users/me')
      .pipe(
        tap((user => this.dbUserSubject.next(user))),
        catchError((err) => {
          console.log('Error fetching current user', err)

          // const errorMessage = this.translateService.instant('errors.fetch-collection-user')
          // this.snackbarService.openSnackBar(errorMessage)
          return throwError(() => err)
        })
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
        switchMap(() =>
          this.apiService.post<UserCredential>('/register-user/with-google', {})
        ),
        catchError(err => {
          console.error('Error registering Google user:', err);
          return of(null)
        })
      )
  }

  // Метод для выхода
  logout(): Observable<void> {
    return from(signOut(firebaseAuth))
      .pipe(
        tap(() => {
          this.authUserSubject.next(null)
          this.dbUserSubject.next(null)
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
