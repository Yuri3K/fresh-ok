import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RestoreScrollService } from './core/services/restore-scroll.service';
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
export class AppComponent implements OnInit, OnDestroy {
  private readonly switchModeService = inject(SwitchModeService)
  private readonly authService = inject(AuthService)
  private readonly langsService = inject(LangsService)
  private readonly translateService = inject(TranslateService)
  private readonly destroRef = inject(DestroyRef)
  private readonly title = inject(Title)
  private readonly meta = inject(Meta)

  readonly authInitializing$: Observable<boolean> = this.authService.authInitializing$
  readonly langs$ = this.langsService.langs$

  async ngOnInit() {
    this.switchModeService.init()
    this.applySeo()
  }

  private applySeo() {
    this.translateService
    .stream('seo')
    .pipe(takeUntilDestroyed(this.destroRef))
    .subscribe(seo => {
      this.title.setTitle(seo['meta-title'])
      this.meta.updateTag({name: 'description', content: seo['meta-descr']})
    })
  }

  ngOnDestroy(): void {
    localStorage.removeItem(environment.lsSavedUrlKey)
  }
}
