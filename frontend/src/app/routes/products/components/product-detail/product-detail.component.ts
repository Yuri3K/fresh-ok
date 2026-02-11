import { Component, DestroyRef, effect, inject, OnDestroy } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProductTabsComponent } from '../../../../shared/components/product-tabs/product-tabs.component';
import { Product, ProductsService } from '../../../../core/services/products.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Breadcrumb, BreadcrumbsService } from '../../../../shared/components/breadcrumbs/breadcrumbs.service';
import { TranslateService } from '@ngx-translate/core';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { ProductCarouselComponent } from '../../../../shared/components/product-page-elems/product-carousel/product-carousel.component';
import { ProductStateService } from '../../../../core/services/product-state.service';
import { ProductContentComponent } from '../../../../shared/components/product-page-elems/product-content/product-content.component';
import { H2TitleComponent } from '../../../../shared/ui-elems/typography/h2-title/h2-title.component';
@Component({
  selector: 'app-product-detail',
  imports: [
    BreadcrumbsComponent,
    ProductTabsComponent,
    ProductCarouselComponent,
    ProductContentComponent,
    H2TitleComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnDestroy{
  readonly currentLang = inject(GetCurrentLangService).currentLang
  private translateService = inject(TranslateService)
  private destroyRef = inject(DestroyRef)
  private breadcrumbsService = inject(BreadcrumbsService)
  private readonly productsService = inject(ProductsService)
  private readonly productStateService = inject(ProductStateService)

  product = toSignal(
    this.productsService.getProductBySlug('pineapple'),
    { initialValue: {} as Product }
  )

  constructor() {

    // Формируем хлебные крошки после получения product() с сервера
    effect(() => {
      const isProduct = this.product().id
      if (isProduct) {
        this.productStateService.setCurrentPruduct(this.product())

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
                url: brcrs.products.url,
              },
              {
                label: this.product().i18n[this.currentLang()].name
              },
            ]
            this.breadcrumbsService.setBreadcrumbs(breadcrumbs)
          })
      }
    })
  }

  ngOnDestroy(): void {
    this.productStateService.resetCurrentProduct()
  }
}
