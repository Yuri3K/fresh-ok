import { Component, effect, inject, input } from '@angular/core';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { CharacteristicItem } from '../../../../core/services/products.service';

@Component({
  selector: 'app-product-characteristics',
  imports: [],
  templateUrl: './product-characteristics.component.html',
  styleUrl: './product-characteristics.component.scss'
})
export class ProductCharacteristicsComponent {
  characteristics = input.required<CharacteristicItem[]>()

  currentlang = inject(GetCurrentLangService).currentLang
}
