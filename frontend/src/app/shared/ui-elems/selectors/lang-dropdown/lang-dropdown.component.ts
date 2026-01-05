import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Lang, LangsService } from '../../../../core/services/langs.service';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';
import { SvgIconPipe } from '../../../../core/pipes/svg-icon.pipe';
import { MEDIA_URL } from '../../../../core/urls';

@Component({
  selector: 'app-lang-dropdown',
  imports: [
    TranslateModule,
    MatIconModule,
    OpenMenuDirective,
    SvgIconPipe,
    AsyncPipe,
  ],
  templateUrl: './lang-dropdown.component.html',
  styleUrl: './lang-dropdown.component.scss',
  standalone: true,
})
export class LangDropdownComponent {
  private langsService = inject(LangsService)

  langs$ = this.langsService.langs$
  currentLang$ = this.langsService.currentLang$

  mediaUrl = MEDIA_URL

  ngOnInit() {
  }

  changeLang(lang: Lang) {
    this.langsService.setLanguage(lang);
  }
}


