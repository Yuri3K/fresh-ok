import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangsService } from '../../../../core/services/langs.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lang-dropdown',
  imports: [
    TranslateModule,
    MatIconModule,
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





// import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
// import { LanguageDropdownService } from "./services/language-dropdown.service";
// import { TranslateService } from "@ngx-translate/core";
// import { StoreService } from "src/app/services/store.service";
// import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
// import { filter, take } from "rxjs";
// import { HttpClient } from "@angular/common/http";

// @Component({
//   selector: 'app-language-dropdown',
//   templateUrl: './language-dropdown.component.html',
//   styleUrls: ['./language-dropdown.component.scss']
// })

// export class LanguageDropdownComponent implements OnInit {

//   constructor(
//     public langDrService: LanguageDropdownService,
//     public translateService: TranslateService,
//     private storeService: StoreService,
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//   ) { }

//   ngOnInit() {
//     this.router.routerState.root.queryParams
//       .pipe(filter(params => params['lang']))
//       .subscribe(queryLang => {
//         this.useLang(queryLang.lang)
//       })
//     this.langDrService.init()
//   }

//   public useLang(lang: string) {
//     this.translateService.use(lang)
//     this.storeService._currentLang$ = lang

//     this.router.navigate([], {
//       relativeTo: this.activatedRoute,
//       queryParams: { lang: lang },
//       queryParamsHandling: 'merge'
//     })
//   }


// }