import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { CatalogStateService } from '../../core/services/products-state.service';
import { H2TitleComponent } from '../../shared/ui-elems/typography/h2-title/h2-title.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCardListComponent } from '../../shared/components/product-card-list/product-card-list.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  imports: [
    H2TitleComponent,
    TranslateModule,
    ProductCardListComponent,
    ProductCardComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements AfterViewInit, OnDestroy{
  stateService = inject(CatalogStateService)
  private resizeObserver?: ResizeObserver

  @ViewChild('productsContent') productsContent!: ElementRef<HTMLDivElement>
  products = this.stateService.products
  pagination = this.stateService.pagination
  view = this.stateService.appliedView

  ngAfterViewInit(): void {
    this.setResizeObserver()
    this.resizeObserver?.observe(this.productsContent.nativeElement)
  }

  private setResizeObserver() {
    this.resizeObserver = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width
      this.stateService.setProductsContainerWidth(width)
    })
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
  }
}
