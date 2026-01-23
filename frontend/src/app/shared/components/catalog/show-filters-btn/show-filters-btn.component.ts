import { Component, DestroyRef, effect, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { CatalogStateService } from '../../../../core/services/products-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-show-filters-btn',
  imports: [MiniFabBtnComponent],
  templateUrl: './show-filters-btn.component.html',
  styleUrl: './show-filters-btn.component.scss'
})
export class ShowFiltersBtnComponent {
  private stateService = inject(CatalogStateService)
  private destroyRef = inject(DestroyRef)
  filtersSidenav = this.stateService.filtersSidenav
  isSidebarOpened!: boolean

  constructor() {
    effect(() => {
      const sidenav = this.filtersSidenav()
      if(sidenav) {
        sidenav.openedChange
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(isOpen => this.isSidebarOpened = isOpen)
      }
    })
  }

}
