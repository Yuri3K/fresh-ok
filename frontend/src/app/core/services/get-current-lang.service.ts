import { inject, Injectable } from '@angular/core';
import { LangsService } from './langs/langs.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Lang } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentLangService {
  private readonly langsService = inject(LangsService)

  currentLang = toSignal(this.langsService.currentLang$
    .pipe(
			filter((lang): lang is Lang => !!lang),
			map(lang => lang.browserLang)
		),
    {
      requireSync: true,
    }
  )

}
