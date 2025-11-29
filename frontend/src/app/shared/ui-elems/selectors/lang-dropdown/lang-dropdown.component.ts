import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Lang, LangsService } from '../../../../core/services/langs.service';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';
import { environment } from '../../../../../environments/environment';
import { SvgIconPipe } from '../../../../core/pipes/svg-icon.pipe';

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

  mediaUrl = environment.cloudinary_url

  ngOnInit() {
  }

  changeLang(lang: Lang) {
    this.langsService.setLanguage(lang);
  }
}


