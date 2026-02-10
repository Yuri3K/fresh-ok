import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { CatalogStateService } from '../../../../core/services/catalog-state.service';

@Component({
  selector: 'app-view-list-btn',
  imports: [
    MiniFabBtnComponent
  ],
  templateUrl: './view-list-btn.component.html',
  styleUrl: './view-list-btn.component.scss'
})
export class ViewListBtnComponent {
  stateService = inject(CatalogStateService)
  appliedView = this.stateService.appliedView

  applyListView() {
    this.stateService.setUserPrefferedView('list')
  }
}
