import { Component, computed, DestroyRef, effect, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProductTabsComponent } from '../../../../shared/components/product-tabs/product-tabs.component';
import { Product, ProductsService } from '../../../../core/services/products.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Breadcrumb, BreadcrumbsService } from '../../../../shared/components/breadcrumbs/breadcrumbs.service';
import { TranslateService } from '@ngx-translate/core';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
@Component({
  selector: 'app-product-detail',
  imports: [
    BreadcrumbsComponent,
    ProductTabsComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  private translateService = inject(TranslateService)
  private destroyRef = inject(DestroyRef)
  private breadcrumbsService = inject(BreadcrumbsService)
  private productsService = inject(ProductsService)
  currentLang = inject(GetCurrentLangService).currentLang

  product = toSignal(
    this.productsService.getProductBySlug('pineapple'),
    { initialValue: {} as Product }
  )

  productName = computed(() => {
    return this.product()?.id
      ? this.product()?.i18n[this.currentLang()].name
      : ''

  })

  constructor() {
    effect(() => {
      const isProduct = this.product().id
      if (isProduct) {
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
}
