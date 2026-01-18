import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';
import { AsyncPipe } from '@angular/common';
import { CatalogService } from '../../../../core/services/catalog.service';
import { LangsService } from '../../../../core/services/langs.service';
import { RouterLink } from '@angular/router';
import { CatalogStateService } from '../../../../core/services/products-state.service';

@Component({
  selector: 'app-catalog-selector',
  templateUrl: './catalog-selector.component.html',
  styleUrls: ['./catalog-selector.component.scss'],
  imports: [
    MatIconModule,
    TranslateModule,
    OpenMenuDirective,
    AsyncPipe,
    RouterLink,
  ]
})
export class CatalogSelectorComponent {
  currentLang$ = inject(LangsService).currentLang$
  catalogService = inject(CatalogService)
  stateService = inject(CatalogStateService)

  catalogList$ = this.catalogService.catalogList$
  selectedCategory = this.stateService.selectedCategory
  // selectedCategory$ = this.catalogService.selectedCategory$

  // selectCategory(category: string) {
  //   this.catalogService.setSelectedCategory(category)
  // }
}
