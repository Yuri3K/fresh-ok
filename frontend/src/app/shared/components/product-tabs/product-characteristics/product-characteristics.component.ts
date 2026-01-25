import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-characteristics',
  imports: [],
  templateUrl: './product-characteristics.component.html',
  styleUrl: './product-characteristics.component.scss'
})
export class ProductCharacteristicsComponent {
  characteristics = input.required()
}
