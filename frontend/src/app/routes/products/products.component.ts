import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CatalogStateService } from '../../core/services/catalog-state.service';
import { H2TitleComponent } from '../../shared/ui-elems/typography/h2-title/h2-title.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { BadgeFilterComponent } from '../../shared/components/catalog/badge-filter/badge-filter.component';
import { PriceFilterComponent } from '../../shared/components/catalog/price-filter/price-filter.component';
import {
  MatSidenav,
  MatSidenavContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { Breadcrumb, BreadcrumbsService } from '../../shared/components/breadcrumbs/breadcrumbs.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    BadgeFilterComponent,
    PriceFilterComponent,
    MatSidenavModule,
    BreadcrumbsComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('productsContent', { read: ElementRef }) productsContent!: ElementRef;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private parentScrollContainer = inject(MatSidenavContent, { optional: true });
  private translateService = inject(TranslateService)
  private destroyRef = inject(DestroyRef)
  private breadcrumbsService = inject(BreadcrumbsService)
  stateService = inject(CatalogStateService);

  private resizeObserver?: ResizeObserver;

  products = this.stateService.products;
  pagination = this.stateService.pagination;
  view = this.stateService.appliedView;
  isCardsBlockThin = this.stateService.isCardsBlockThin;
  isViewBtnsVisible = this.stateService.isViewBtnsVisible;
  isLoading = this.stateService.isLoading;
  isSidenavOpenByDefault = this.stateService.isSidenavOpenByDefault;
  sidenavMode = this.stateService.sidenavMode;

  private scrollPosition = 0;

  ngAfterViewInit() {
    this.setResizeObserver();
    this.resizeObserver?.observe(this.productsContent.nativeElement);

    this.stateService.setFiltersSidebar(this.sidenav)

    this.defineBreadcrumbs()

  }

  private defineBreadcrumbs() {
    this.translateService
      .stream('breadcrumbs')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(brcrs => {
        const breadcrumbs: Breadcrumb[] = [
          {
            label: brcrs.homepage.name,
            url: brcrs.homepage.url,
            icon: 'home',
          },
          {
            label: brcrs.products.name,
          },
        ]
        this.breadcrumbsService.setBreadcrumbs(breadcrumbs)
      })
  }

  private setResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      // console.log("🔸 width:", width)
      this.stateService.setProductsContainerWidth(width);
    });
  }

  onBackdropClick() {
    if (this.parentScrollContainer) {
      // Читаем скролл у родителя, который на самом деле и скроллится
      this.scrollPosition = this.parentScrollContainer.getElementRef().nativeElement.scrollTop;
      this.restoreScroll();
    }
  }

  private restoreScroll() {
    requestAnimationFrame(() => {
      if (this.parentScrollContainer) {
        this.parentScrollContainer.scrollTo({ top: this.scrollPosition });
      }
    })
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
