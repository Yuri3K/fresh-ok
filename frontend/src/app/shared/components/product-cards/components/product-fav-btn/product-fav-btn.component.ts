import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '@shared/models';
import { FavsService } from '@core/services/favs.service';

@Component({
  selector: 'app-product-fav-btn',
  imports: [
    MiniFabBtnComponent,
    TranslateModule,
  ],
  templateUrl: './product-fav-btn.component.html',
  styleUrl: './product-fav-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFavBtnComponent {
  product = input.required<Product>()
  size = input<'default' | 'big'>('default')

  protected readonly favsService = inject(FavsService)

  btnWidth = computed(() => this.size() == 'default' ? '40px' : '44px')

   // Вычисляем состояние кнопки реактивно
  isFav = computed(() => this.favsService.isFav(this.product().id))
  isDisabled = computed(() => this.favsService.isPending(this.product().id))

  toggleFav() {
    this.favsService.toggleFav(this.product().id)
  }
}
