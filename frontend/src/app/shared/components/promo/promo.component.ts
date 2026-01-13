import { Component, signal } from '@angular/core';
import { H2TitleComponent } from '../../ui-elems/typography/h2-title/h2-title.component';
import { LoaderComponent } from '../loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { BtnFlatComponent } from '../../ui-elems/buttons/btn-flat/btn-flat.component';
import { Product } from '../../../core/services/products.service';

@Component({
  selector: 'app-promo',
  imports: [
    H2TitleComponent,
    LoaderComponent,
    TranslateModule,
    BtnFlatComponent


  ],
  templateUrl: './promo.component.html',
  styleUrl: './promo.component.scss'
})
export class PromoComponent {

  promoProducts = signal<Product[]>([]);
  appliedFilter = signal('all');
  isLoading = signal(true);
}
