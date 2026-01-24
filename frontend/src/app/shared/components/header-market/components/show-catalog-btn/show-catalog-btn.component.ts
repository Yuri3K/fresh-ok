import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { ShowCatalogService } from './show-catalog.service';

@Component({
  selector: 'app-show-catalog-btn',
  imports: [MiniFabBtnComponent],
  templateUrl: './show-catalog-btn.component.html',
  styleUrl: './show-catalog-btn.component.scss'
})
export class ShowCatalogBtnComponent {
  showCatalogService = inject(ShowCatalogService)
}
