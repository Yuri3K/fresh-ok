import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-rate',
  imports: [
    MatIconModule
  ],
  templateUrl: './product-rate.component.html',
  styleUrl: './product-rate.component.scss'
})
export class ProductRateComponent {
  rate = input.required<number>()
}
