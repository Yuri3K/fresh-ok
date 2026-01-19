import { Component, DestroyRef, inject } from '@angular/core';
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
  filtersSidenav$ = this.stateService.filtersSidenav$
  isSidebarOpened!: boolean

  ngOnInit() {
    this.filtersSidenav$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(sidenav => {
        if (sidenav) {
          sidenav.openedChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(res => {
              this.isSidebarOpened = res
            })
        }
      })
  }


}
