import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '@core/services/api.service';
import { FavsService } from '@core/services/favs.service';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { MEDIA_URL } from '@core/urls';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ProductCardComponent } from '@shared/components/product-cards/product-card/product-card.component';
import { Product } from '@shared/models';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { H2TitleComponent } from '@shared/ui-elems/typography/h2-title/h2-title.component';
import { H4TitleComponent } from '@shared/ui-elems/typography/h4-title/h4-title.component';
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
  ],
  templateUrl: './favs.component.html',
  styleUrl: './favs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavsComponent {
  protected readonly favsService = inject(FavsService)
  private readonly apiService = inject(ApiService)
  private readonly navigateService = inject(LangRouterService)


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
