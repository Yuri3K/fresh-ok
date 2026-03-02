import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
import { replaceSubStr } from '@core/utils/replace-sub-str.util';
import { ProductStateService } from '@core/services/product-state.service';
import { ProductsService } from '@core/services/products.service';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { Breadcrumb, BreadcrumbsService } from '@shared/components/breadcrumbs/breadcrumbs.service';
import { ProductCarouselComponent } from '@shared/components/product-page-elems/product-carousel/product-carousel.component';
import { ProductContentComponent } from '@shared/components/product-page-elems/product-content/product-content.component';
import { ProductTabsComponent } from '@shared/components/product-tabs/product-tabs.component';
import { Product } from '@shared/models';
import { H2TitleComponent } from '@shared/ui-elems/typography/h2-title/h2-title.component';
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
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements  OnDestroy {
  protected readonly currentLang = inject(GetCurrentLangService).currentLang
  private readonly breadcrumbsService = inject(BreadcrumbsService)
  private readonly productsService = inject(ProductsService)
  private readonly productStateService = inject(ProductStateService)
  private readonly translateService = inject(TranslateService)
  private readonly title = inject(Title)
  private readonly meta = inject(Meta)

  product = toSignal(
    this.productsService.getProductBySlug('pineapple'),
    { initialValue: {} as Product }
  )

  private seoTranslates = toSignal(
    this.translateService.stream('seo.product-page'),
    { initialValue: { 'meta-title': '', 'meta-descr': '' } }
  )

  constructor() {
    effect(() => {
      const brcrs = this.breadcrumbsService.brcrTranslations()
      const isProduct = this.product().id

      if (isProduct && brcrs) {
        this.productStateService.setCurrentPruduct(this.product())
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
            label: this.product().i18n[this.currentLang()].name,
          },
        ]
        this.breadcrumbsService.setBreadcrumbs(breadcrumbs)
      }
    })

    effect(() => {
      const product = this.product()

      if(product.id) {
        this.applySeo()
      }
    })
  }

  private applySeo() {
    const productName = this.product().i18n[this.currentLang()].name

    const title = replaceSubStr(this.seoTranslates()['meta-title'], {productName})
    const descr = replaceSubStr(this.seoTranslates()['meta-descr'], {productName})

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: descr });
  }

  ngOnDestroy(): void {
    this.productStateService.resetCurrentProduct()
  }
}
