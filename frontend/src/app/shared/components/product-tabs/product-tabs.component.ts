import { Component, computed, inject } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { ProductReviewsComponent } from './product-reviews/product-reviews.component';
import { ProductDescrComponent } from './product-descr/product-descr.component';
import { ProductCharacteristicsComponent } from './product-characteristics/product-characteristics.component';
import { TabsDirective } from '../tabs/tabs.directive';
import { GetCurrentLangService } from '../../../core/services/get-current-lang.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProductStateService } from '../../../core/services/product-state.service';

@Component({
  selector: 'app-product-tabs',
  imports: [
    TabsComponent,
    ProductReviewsComponent,
    ProductDescrComponent,
    ProductCharacteristicsComponent,
    TabsDirective,
    TranslateModule,
  ],
  templateUrl: './product-tabs.component.html',
  styleUrl: './product-tabs.component.scss'
})
export class ProductTabsComponent {
  private productStateService = inject(ProductStateService)
  
  product$ = this.productStateService.currentProduct$
  currentLang = inject(GetCurrentLangService).currentLang

  currentProduct = computed(() => this.product$())

}
