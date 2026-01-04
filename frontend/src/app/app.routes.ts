import { Router, Routes } from '@angular/router';
import { isAlreadyAuthGuard } from './core/guards/is-already-auth.guard';
import { Error403Component } from './shared/components/403/403.component';
import { Error404Component } from './shared/components/404/404.component';
import { LangGuard } from './core/guards/lang.guard';
import { inject } from '@angular/core';
import { LangsService } from './core/services/langs.service';
import { filter, map, take } from 'rxjs';

export const routes: Routes = [
  {
    path: ':lang',
    canActivate: [LangGuard], // Проверяет корректность кода языка (en, ru, uk)
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./shared/components/public-layout/public-layout.routes').then(
            (m) => m.routes
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./shared/components/admin-layout/admin-layout.routes').then(
            (m) => m.routes
          ),
      },
      {
        path: 'login',
        canActivate: [isAlreadyAuthGuard],
        loadChildren: () =>
          import('./routes/login/login.routes').then((m) => m.routes),
      },
      {
        path: 'register',
        canActivate: [isAlreadyAuthGuard],
        loadChildren: () =>
          import('./routes/register/register.routes').then((m) => m.routes),
      },
      {
        path: '403',
        component: Error403Component,
      },
      {
        path: '404',
        // canActivate: [LangGuard],
        component: Error404Component,
      },
    ],
  },
  // // Редирект с корня localhost:4200 на localhost:4200/ru (или другой язык)
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   canActivate: [() => {
  //     const langsService = inject(LangsService);
  //     const router = inject(Router);

  //     // return langsService.langs$.pipe(
  //       // filter(langs => langs.length > 0), // ждем загрузки языков
  //       // take(1),
  //       // map(() => {
  //         const targetLang = langsService.resolveTargetLang();
  //         console.log("🔸 targetLang IN EMPTY:", targetLang)
  //         return router.parseUrl(`/${targetLang}/home`);
  //     //   })
  //     // );
  //   }],
  //   children: []
  // },

  {
    path: '',
    pathMatch: 'full',
    canActivate: [LangGuard],
    children: [], // Этот блок сработает только для редиректа
  },
  // {
  //   path: '**',
  //   redirectTo: '404',
  // }

  {
    path: '**',
    canActivate: [() => {
      const langsService = inject(LangsService);
      const router = inject(Router);

      // return langsService.langs$.pipe(
        // filter(langs => langs.length > 0),
        // take(1),
        // map(() => {
          const targetLang = langsService.resolveTargetLang();
          console.log("🔸 targetLang IN **:", targetLang)
          return router.parseUrl(`/${targetLang}/404`);
      //   })
      // );
    }],
    children: []
  }
];
