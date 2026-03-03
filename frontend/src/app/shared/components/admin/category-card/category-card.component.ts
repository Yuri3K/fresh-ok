import { Component, input } from '@angular/core';
import { CatalogItem } from '@core/services/catalog.service';

@Component({
  selector: 'app-category-card',
  imports: [],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
  readonly category = input.required<CatalogItem>()
}
