import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Banner } from '../services/banners.service';
import { RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';

import { GetCurrentLangService } from '../../../../../core/services/get-current-lang.service';
import { LangRouterService } from '../../../../../core/services/langs/lang-router.service';

@Component({
  selector: 'app-banner-item',
  imports: [
    RouterLink,
    NgStyle
  ],
  templateUrl: './banner-item.component.html',
  styleUrl: './banner-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerItemComponent {
  currentLang = inject(GetCurrentLangService).currentLang
  langRouterService = inject(LangRouterService)

  banner = input.required<Banner>()

  routerLink = computed(() => {
    return this.langRouterService.transformToRouterLink(this.banner().linkUrl)
  })
}
