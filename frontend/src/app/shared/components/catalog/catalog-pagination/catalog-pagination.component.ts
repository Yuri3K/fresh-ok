import { Component, inject } from '@angular/core';
import { CatalogStateService } from '../../../../core/services/products-state.service';
import { MiniFabBtnComponent } from '../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-catalog-pagination',
  imports: [
    MiniFabBtnComponent
  ],
  templateUrl: './catalog-pagination.component.html',
  styleUrl: './catalog-pagination.component.scss'
})
export class CatalogPaginationComponent {
  private stateService = inject(CatalogStateService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  pagination = this.stateService.pagination

  next() {
    if(!this.pagination().hasNextPage) return

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: (this.pagination().currentPage + 1).toString() },
      queryParamsHandling: 'merge'
    })
  }

  prev() {
    console.log("!!! PREV !!!")
    if(!this.pagination().hasPreviousPage) return

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: (this.pagination().currentPage - 1).toString() },
      queryParamsHandling: 'merge'
    })
  }

  goTo(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page.toString() },
      queryParamsHandling: 'merge'
    })
  }
}


