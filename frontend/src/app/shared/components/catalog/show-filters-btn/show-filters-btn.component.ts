import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { CatalogStateService } from '../../../../core/services/products-state.service';

@Component({
  selector: 'app-show-filters-btn',
  imports: [MiniFabBtnComponent],
  templateUrl: './show-filters-btn.component.html',
  styleUrl: './show-filters-btn.component.scss'
})
export class ShowFiltersBtnComponent {
  private stateService = inject(CatalogStateService)
  isFiltersVisible = this.stateService.isFiltersVisible

  toggleFilters() {
    this.stateService.setIsFiltersVisible(!this.isFiltersVisible())
  }
}
