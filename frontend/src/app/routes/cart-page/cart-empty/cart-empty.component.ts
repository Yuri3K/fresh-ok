import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { MEDIA_URL } from '@core/urls';
import { TranslateModule } from '@ngx-translate/core';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { H3TitleComponent } from '@shared/ui-elems/typography/h3-title/h3-title.component';

@Component({
  selector: 'app-cart-empty',
  imports: [
    TranslateModule,
    BtnFlatComponent,
    H3TitleComponent
  ],
  templateUrl: './cart-empty.component.html',
  styleUrl: './cart-empty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartEmptyComponent {
  private readonly navigateService = inject(LangRouterService)

  protected readonly imgUrl = `${MEDIA_URL}heroes/empty-cart`

  goToCatalog() {
    this.navigateService.navigate(['/products'])
  }
}
