import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangsService } from '../../../../core/services/langs.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';
import { MatSvgIconPipe } from '../../../../core/pipes/mat-svg-icon.pipe';

@Component({
  selector: 'app-lang-dropdown',
  imports: [
    TranslateModule,
    MatIconModule,
    OpenMenuDirective,
    MatSvgIconPipe,
    AsyncPipe,
    NgFor,
  ],
  templateUrl: './lang-dropdown.component.html',
  styleUrl: './lang-dropdown.component.scss',
  standalone: true,
})
export class LangDropdownComponent {
  private translateService = inject(TranslateService)
  private langsService = inject(LangsService)

  langs$ = inject(LangsService).langs$

  currentLang = this.translateService.getCurrentLang()
  
  ngOnInit() {
    console.log("🚀 currentLang:", this.currentLang)    
  }

  changeLang(event: Event) {
    const lang = (event.target as HTMLSelectElement).value
    this.langsService.setLanguage(lang);
    this.currentLang = lang;
  }
}


