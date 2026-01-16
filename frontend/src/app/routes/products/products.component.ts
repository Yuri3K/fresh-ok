import { Component, inject } from '@angular/core';
import { CatalogStateService } from '../../core/services/products-state.service';

@Component({
  selector: 'app-products',
  imports: [
    
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  stateService = inject(CatalogStateService)
}
