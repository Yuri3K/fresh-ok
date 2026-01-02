import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LangRouterService } from './lang-router.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectService {
  private navigateService = inject(LangRouterService);

  navigateAfterLogin() {
    const lsKey = environment.lsSavedUrlKey;
    const savedUrl = localStorage.getItem(lsKey);
    if (savedUrl) {
      // Если не авторизированный пользователь пытался перейти на защищенный роут
      // то его запрошенный url будет сохранен в Local Storage (authGuard), а сам пользователь
      // будет переведен на страницу /login, и после успешной авторизации, будет
      // переведен на сохраненный URL
      this.navigateService.navigateByUrl(savedUrl);
      localStorage.removeItem(lsKey);
    } else {
      // Если сохраненного URL нет — переходим на /home
      this.navigateService.navigate(['/home']);
    }
  }
}
