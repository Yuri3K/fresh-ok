import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
import { MEDIA_URL } from '@core/urls';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '@shared/models';
import { BtnIconComponent } from "@shared/ui-elems/buttons/btn-icon/btn-icon.component";
import { H6TitleComponent } from "@shared/ui-elems/typography/h6-title/h6-title.component";
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-product-slides',
  imports: [
    BtnIconComponent,
    TranslateModule,
    H6TitleComponent,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './product-slides.component.html',
  styleUrl: './product-slides.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSlidesComponent {
  readonly product = input<Product>()

  protected currentLang = inject(GetCurrentLangService).currentLang

  protected readonly slides = computed(() => {
    if (this.product()?.slides) {
      return this.product()?.slides
        .sort((a, b) => a.order - b.order)
        .map(s => {
          return {
            order: s.order,
            imgUrl: `${MEDIA_URL}v${s.version}/${s.publicId}`
          }
        })
    } else return []

  })

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.slides()!, event.previousIndex, event.currentIndex);
  }
}
