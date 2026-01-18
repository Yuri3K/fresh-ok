import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  viewChild,
  ViewChild,
} from '@angular/core';
import { CatalogStateService } from '../../core/services/products-state.service';
import { H2TitleComponent } from '../../shared/ui-elems/typography/h2-title/h2-title.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCardListComponent } from '../../shared/components/product-cards/product-card-list/product-card-list.component';
import { ProductCardComponent } from '../../shared/components/product-cards/product-card/product-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ViewListBtnComponent } from '../../shared/components/catalog/view-list-btn/view-list-btn.component';
import { ViewGridBtnComponent } from '../../shared/components/catalog/view-grid-btn/view-grid-btn.component';
import { CatalogPaginationComponent } from '../../shared/components/catalog/catalog-pagination/catalog-pagination.component';
import { ShowFiltersBtnComponent } from '../../shared/components/catalog/show-filters-btn/show-filters-btn.component';
import { SortingByComponent } from '../../shared/components/catalog/sorting-by/sorting-by.component';
import { LimitByComponent } from '../../shared/components/catalog/limit-by/limit-by.component';
import { CatalogFilterComponent } from '../../shared/components/catalog/catalog-filter/catalog-filter.component';

@Component({
  selector: 'app-products',
  imports: [
    H2TitleComponent,
    TranslateModule,
    ProductCardListComponent,
    ProductCardComponent,
    LoaderComponent,
    ViewListBtnComponent,
    ViewGridBtnComponent,
    CatalogPaginationComponent,
    ShowFiltersBtnComponent,
    SortingByComponent,
    LimitByComponent,
    CatalogFilterComponent,

  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnDestroy {
  stateService = inject(CatalogStateService);
  private resizeObserver?: ResizeObserver;

  // @ViewChild('productsContent') productsContent!: ElementRef<HTMLDivElement>;
  productsContent = viewChild.required<ElementRef<HTMLDivElement>>('productsContent')
  products = this.stateService.products;
  pagination = this.stateService.pagination;
  view = this.stateService.appliedView;
  isLoading = this.stateService.isLoading;

 constructor() {
    effect(() => {     
      if (this.productsContent()?.nativeElement) {
        this.setResizeObserver();
        this.resizeObserver?.observe(this.productsContent().nativeElement);
      }
    })
  }

  private setResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      console.log('🚀 ~ width:', width);
      this.stateService.setProductsContainerWidth(width);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
