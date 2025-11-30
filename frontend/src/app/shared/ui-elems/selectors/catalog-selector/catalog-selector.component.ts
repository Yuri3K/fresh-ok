import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, filter, tap } from 'rxjs';
import { CatalogDropDownItem } from './interfaces/catalog-dropdown.interface';

@Component({
  selector: 'app-catalog-selector',
  templateUrl: './catalog-selector.component.html',
  styleUrls: ['./catalog-selector.component.scss'],
})
export class CatalogDropdownComponent implements OnInit, OnDestroy {
  catalogList: CatalogDropDownItem[];
  activeCategory: string;
  activeCategorySub: Subscription;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.getCatalogList();
    this.getActiveCategoty();
  }

  private getCatalogList() {
    this.translateService
      .stream('header-bottom.catalog-dropdown.catalog-list')
      // .pipe(filter(data => typeof data === 'object'))
      .subscribe((data: CatalogDropDownItem[]) => {
        this.catalogList = data;
      });
  }
  private getActiveCategoty() {
    this.activeCategorySub = this.storeService._activeCategory$.subscribe(
      (category) => (this.activeCategory = category)
    );
  }

  public updateCategory(category: string) {
    this.storeService._activeCategory$ = category;
  }

  ngOnDestroy() {
    this.activeCategorySub.unsubscribe();
  }
}
