import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { DbUser } from '@shared/models';
import { AvatarImageService } from './avatar-image.service';
import { MEDIA_URL } from '@core/urls';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {
  private readonly apiService = inject(ApiService)
  private readonly imageService = inject(AvatarImageService)
  private readonly dbUserSubject = new BehaviorSubject<DbUser | null | undefined>(undefined)

  readonly dbUser$ = this.dbUserSubject.asObservable()

  setDbUser(user: DbUser | null) {
    console.log("🔸 user:", user)
    this.dbUserSubject.next(user)
    if(user && user.avatarId && user.avatarVersion) {
      const url = `${MEDIA_URL}v${user.avatarVersion}/${user.avatarId}`
      this.imageService.setAvatarUrl(url)
    } else {
      this.imageService.setAvatarUrl('')
    }
  }

  fetchDbUser(): Observable<DbUser> {
    return this.apiService.get<DbUser>('/users/me')
      .pipe(
        tap((user => this.setDbUser(user)))
      )
  }

  /**
  * Проверка роли пользователя
  */
  hasRole(roles: string[]): boolean {
    const user = this.dbUserSubject.getValue()

    if (!user || !user.role) {
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
}
