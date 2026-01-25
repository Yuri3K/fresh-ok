import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-descr',
  imports: [],
  templateUrl: './product-descr.component.html',
  styleUrl: './product-descr.component.scss'
})
export class ProductDescrComponent {
  descr = input.required()
}
