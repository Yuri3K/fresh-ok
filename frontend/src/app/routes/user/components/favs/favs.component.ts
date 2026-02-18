import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '@core/services/api.service';
import { FavsService } from '@core/services/favs.service';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { MEDIA_URL } from '@core/urls';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { Breadcrumb, BreadcrumbsService } from '@shared/components/breadcrumbs/breadcrumbs.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ProductCardComponent } from '@shared/components/product-cards/product-card/product-card.component';
import { Product } from '@shared/models';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { H2TitleComponent } from '@shared/ui-elems/typography/h2-title/h2-title.component';
import { H5TitleComponent } from '@shared/ui-elems/typography/h5-title/h5-title.component';

@Component({
  selector: 'app-favs',
  imports: [
    ProductCardComponent,
    TranslateModule,
    MatButtonModule,
    LoaderComponent,
    H2TitleComponent,
    H5TitleComponent,
    BtnFlatComponent,
    BreadcrumbsComponent,

  ],
  templateUrl: './favs.component.html',
  styleUrl: './favs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavsComponent {
  protected readonly favsService = inject(FavsService)
  private readonly apiService = inject(ApiService)
  private readonly navigateService = inject(LangRouterService)
  private readonly breadcrumbsService = inject(BreadcrumbsService)

  protected readonly productIds = computed(() => this.favsService.productIds())
  protected readonly products = signal<Product[]>([])
  protected readonly isLoading = signal(true)
  protected readonly imgUrl = `${MEDIA_URL}heroes/cat-freshok`

  constructor() {
    effect(() => {
      if (this.productIds().length > 0) {
        this.products.update(prods => prods.filter(p => this.productIds().includes(p.id)))
        this.loadFavProducts()
      } else {
        this.isLoading.set(false)
      }
    })

    effect(() => {
      const brcrs = this.breadcrumbsService.brcrTranslations()
      if (brcrs) {
        const breadcrumbs: Breadcrumb[] = [
          {
            label: brcrs.homepage.name,
            url: brcrs.homepage.url,
            icon: 'home',
          },
          {
            label: brcrs.user.name,
            url: brcrs.user.url,
          },
          {
            label: brcrs.favs.name,
          },
        ]
        this.breadcrumbsService.setBreadcrumbs(breadcrumbs)
      }
    })
  }

  private loadFavProducts() {

    if (this.productIds().length === 0) {
      this.products.set([])
      return
    }

    this.apiService.get<Product[]>('/favs/products', [`productIds=${this.productIds()}`])
      .subscribe({
        next: products => {
          this.products.set(products)
        },
        error: err => {
          console.error('[FavsComponent] loadFavProducts error:', err)
        },
        complete: () => this.isLoading.set(false)
      })
  }

  goToCatalog() {
    this.navigateService.navigate(['/products'])
  }

}
