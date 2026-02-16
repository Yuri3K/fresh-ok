import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { CharacteristicItem } from '@shared/models';

@Component({
  selector: 'app-product-characteristics',
  imports: [],
  templateUrl: './product-characteristics.component.html',
  styleUrl: './product-characteristics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCharacteristicsComponent {
  characteristics = input.required<CharacteristicItem[]>()

  currentlang = inject(GetCurrentLangService).currentLang
}
