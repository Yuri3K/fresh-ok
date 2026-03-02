import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SwitchModeService } from './core/services/switch-mode.service';
import { AuthService } from './core/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from './shared/components/loader/loader.component';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { LangsService } from './core/services/langs/langs.service';
import { filter, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AsyncPipe,
    LoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnDestroy {
  private readonly switchModeService = inject(SwitchModeService)
  private readonly authService = inject(AuthService)
  private readonly langsService = inject(LangsService)
  private readonly translateService = inject(TranslateService)
  // private readonly seoService = inject(SeoService) // срабатывает конструктор в сервисе
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);

  readonly authInitializing$: Observable<boolean> = this.authService.authInitializing$
  readonly langs$ = this.langsService.langs$

  private seoTranslates = toSignal(
    this.translateService.stream('seo.main-page'),
    { initialValue: { 'meta-title': '', 'meta-descr': '' } }
  )

  private readonly routerEnd = toSignal(
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd)),
    { initialValue: null }
  )

  constructor() {
    effect(() => {
      const translaions = this.seoTranslates()
      const routerEnd = this.routerEnd()

      if (translaions && routerEnd) {
        // убираем префикс языка: /ru/, /uk/, /en/ 
        const cleanUrl = routerEnd.urlAfterRedirects.replace(/^\/(ru|uk|en)(\/|$)/, '/');

        if (cleanUrl === '/' || cleanUrl.startsWith('/home')) {
          this.applySeo();
        }

      }
    })
  }

  async ngOnInit() {
    this.switchModeService.init()
  }

  private applySeo() {
    this.title.setTitle(this.seoTranslates()['meta-title'])
    this.meta.updateTag(this.seoTranslates()['meta-descr'])
  }

  ngOnDestroy(): void {
    localStorage.removeItem(environment.lsSavedUrlKey)
  }
}
