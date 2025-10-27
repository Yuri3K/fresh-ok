import { inject, Injectable } from '@angular/core';
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { firebaseAuth } from '../firebase.client';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router)
  private readonly apiService = inject(ApiService)

  private readonly userSubject = new BehaviorSubject<User | null | undefined>(undefined)
  private readonly authInitializingSubject = new BehaviorSubject<boolean>(true)

  user$ = this.userSubject.asObservable()
  authInitializing$ = this.authInitializingSubject.asObservable()

  constructor() {
    onAuthStateChanged(firebaseAuth, user => {
      this.userSubject.next(user)
      this.authInitializingSubject.next(false)

      const currentUrl = this.router.url;

      if (user) {
        if (currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/') {
          this.router.navigate(['/home']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    })
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
