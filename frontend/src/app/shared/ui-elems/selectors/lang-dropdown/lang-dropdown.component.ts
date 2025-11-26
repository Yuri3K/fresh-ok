import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Lang, LangsService } from '../../../../core/services/langs.service';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';
import { MatSvgIconPipe } from '../../../../core/pipes/mat-svg-icon.pipe';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-lang-dropdown',
  imports: [
    TranslateModule,
    MatIconModule,
    OpenMenuDirective,
    MatSvgIconPipe,
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


