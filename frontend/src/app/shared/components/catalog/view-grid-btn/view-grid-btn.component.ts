import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { CatalogStateService } from '../../../../core/services/catalog-state.service';

@Component({
  selector: 'app-view-grid-btn',
  imports: [MiniFabBtnComponent],
  templateUrl: './view-grid-btn.component.html',
  styleUrl: './view-grid-btn.component.scss'
})
export class ViewGridBtnComponent {
  stateService = inject(CatalogStateService)
  appliedView = this.stateService.appliedView

  applyGridView() {
    this.stateService.setUserPrefferedView('grid')
  }
}
