import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { Banner } from '../services/banners.service';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgStyle } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LangCode } from '../../../../../core/services/langs.service';

@Component({
  selector: 'app-banner-item',
  imports: [
    RouterLink,
    NgStyle
  ],
  templateUrl: './banner-item.component.html',
  styleUrl: './banner-item.component.scss'
})
export class BannerItemComponent {
  translateService = inject(TranslateService);
  destroyRef = inject(DestroyRef)

  banner = input.required<Banner>()

  currentLang = signal(this.normalizeLang(this.translateService.getCurrentLang()))

  constructor() {
    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        this.currentLang.set(this.normalizeLang(event.lang));
      });
  }

  private normalizeLang(lang: string): keyof Banner['translations'] {
    return lang.split('-')[0] as keyof Banner['translations'];
  }

}
