import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  signal,
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
import { BadgeFilterComponent } from '../../shared/components/catalog/badge-filter/badge-filter.component';
import { PriceFilterComponent } from '../../shared/components/catalog/price-filter/price-filter.component';
import {
  MatSidenav,
  MatSidenavContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
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
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('productsContent', { read: ElementRef }) productsContent!: ElementRef;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  private parentScrollContainer = inject(MatSidenavContent, { optional: true });
  stateService = inject(CatalogStateService);
  private dstroyRef = inject(DestroyRef);
  private breakpointObserver = inject(BreakpointObserver);
  private resizeObserver?: ResizeObserver;

  products = this.stateService.products;
  pagination = this.stateService.pagination;
  view = this.stateService.appliedView;
  isLoading = this.stateService.isLoading;
  isLargeScreen = signal(true);
  sidenavMode = signal<'side' | 'over'>('side');

  private scrollPosition = 0;

  ngAfterViewInit() {
    this.setResizeObserver();
    this.resizeObserver?.observe(this.productsContent.nativeElement);

    this.setBreakpointObserver()
    this.stateService.setFiltersSidebar(this.sidenav)

    // Отслеживаем открытие/закрытие sidenav
    this.sidenav.openedChange
      .pipe(takeUntilDestroyed(this.dstroyRef))
      .subscribe((opened) => {
        if (!opened && this.sidenavMode() === 'over') {
          console.log("IN")
          // Восстанавливаем позицию скролла после закрытия
          setTimeout(() => {
            this.restoreScroll();
          }, 0);
        }
      });
  }

  private setBreakpointObserver() {
    this.breakpointObserver
      .observe(['(min-width: 1330px)'])
      .pipe(takeUntilDestroyed(this.dstroyRef))
      .subscribe(result => {
        this.isLargeScreen.set(result.matches)
        if (result.matches) {
          // Экран >= 1360px: режим 'side', сайдбар открыт
          this.sidenavMode.set('side');
          this.sidenav.open();
        } else {
          // Экран < 1360px: режим 'over', сайдбар закрыт
          this.sidenavMode.set('over');
          this.sidenav.close();
        }
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
    } else {
      // Если родителя нет, берем стандартное окно
      this.scrollPosition = window.scrollY;
    }
    console.log("🔸 Реальная позиция скролла родителя:", this.scrollPosition);
  }

  private restoreScroll() {
    if (this.parentScrollContainer) {
      this.parentScrollContainer.scrollTo({ top: this.scrollPosition });
    } else {
      window.scrollTo(0, this.scrollPosition);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
