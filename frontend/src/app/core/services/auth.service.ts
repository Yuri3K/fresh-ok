import { inject, Injectable } from '@angular/core';
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User } from 'firebase/auth';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { firebaseAuth } from '../firebase.client';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { SnackbarService } from './snackbar.service';
import { TranslateService } from '@ngx-translate/core';

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
  private readonly translateService = inject(TranslateService)

  private readonly authUserSubject = new BehaviorSubject<User | null | undefined>(undefined)
  private readonly dbUserSubject = new BehaviorSubject<dbUser | null>(null)
  private readonly authInitializingSubject = new BehaviorSubject<boolean>(true)

  user$ = this.authUserSubject.asObservable()
  role$ = this.dbUserSubject.pipe(map(u => u?.role || null))
  authInitializing$ = this.authInitializingSubject.asObservable()

  constructor() {
    onAuthStateChanged(firebaseAuth, user => {
      this.authUserSubject.next(user)
      this.authInitializingSubject.next(false)

      const currentUrl = this.router.url;

      if (user) {
        // this.fetchDbUser()
          // .subscribe(() => {
            if (currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/') {
              this.router.navigate(['/home']);
            }
          // })
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  private fetchDbUser(): Observable<dbUser> {
    return this.apiService.get<dbUser>('/users/me')
    .pipe(
      tap((user => this.dbUserSubject.next(user))),
      catchError((err) => {
        console.log('Error fetching current user', err)
        const errorMessage = this.translateService.instant('errors.fetch-collection-user')
        this.snackbarService.openSnackBar(errorMessage)
        return throwError(() => err)
      })
    )
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(firebaseAuth, email, password)
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(firebaseAuth, provider)

    try {
      this.apiService.post('/register-user/with-google', {}).subscribe()
    } catch (err) {
      console.error('Error registering Google user:', err);
    }
  }

  // Метод для выхода
  async logout(): Promise<void> {
    await signOut(firebaseAuth)
  }

  // Получить текущий idToken для отправки на бэкенд
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = firebaseAuth.currentUser
    return user ? user.getIdToken(forceRefresh) : null
  }

  // Быстрая проверка авторизации
  isAuthenticated(): boolean {
    return !!firebaseAuth.currentUser
  }
}
