import { Component, computed, inject, input } from '@angular/core';
import { Banner } from '../services/banners.service';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgStyle } from '@angular/common';

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
  banner = input.required<Banner>()

  currentLang = computed(() => {
    const lang = this.translateService.getCurrentLang().split('-')[0] || 'en'
    return lang as keyof Banner['translations']
  })

  ngOnInit() {
    // this.translateService.stream('hello')
    // .subscribe(s => {
    //   console.log("!!! CHANGED !!!")
    // })
    this.translateService.onLangChange
    .subscribe(lang => {
      console.log("!!! LANG !!!", lang)
    })
  }

}
