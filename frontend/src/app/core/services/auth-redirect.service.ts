import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectService {
  private readonly router = inject(Router)

  navigateAfterLogin() {
    const lsKey = environment.lsSavedUrlKey
    const savedUrl = localStorage.getItem(lsKey)
    if (savedUrl) {
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
}
