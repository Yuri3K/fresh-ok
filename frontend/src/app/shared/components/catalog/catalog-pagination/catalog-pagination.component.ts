import { Component, computed, inject } from '@angular/core';
import { CatalogStateService } from '../../../../core/services/catalog-state.service';
import { MiniFabBtnComponent } from '../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';

@Component({
  selector: 'app-catalog-pagination',
  imports: [MiniFabBtnComponent],
  templateUrl: './catalog-pagination.component.html',
  styleUrl: './catalog-pagination.component.scss',
})
export class CatalogPaginationComponent {
  private stateService = inject(CatalogStateService);

  readonly pagination = this.stateService.pagination;
  readonly currentPage = this.stateService.currentPage;
  readonly hasNext = computed(() => this.pagination().hasNextPage);
  readonly hasPrevious = computed(() => this.pagination().hasPreviousPage);
  readonly totalPages = computed(() => this.pagination().totalPages || 0);

  readonly visiblePages = computed(() => {
    const total = this.pagination().totalPages;
    const current = this.currentPage();

    if (!total || total < 0) return [];

    // Для малого количества страниц показываем все
    if (total < 7) {
      // Искусственно настраиваем Array.from.
      // Указываем length и элементы, которые попадут в массив
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // =============================
    // Умная пагинация с многоточием
    // =============================

    const pages: (number | string)[] = [];

    // Всегда показываем первую страницу
    pages.push(1);

    if (current <= 3) {
      // Начало списка
      pages.push(2, 3, 4, '...', total);
    } else if (current >= total - 2) {
      // Конец списка
      pages.push('...', total - 3, total - 2, total - 1, total);
    } else {
      // Середина списка
      pages.push('...', current - 1, current, current + 1, '...', total);
    }

    return pages;
  });

  next() {
    this.stateService.nextPage();
  }

  prev() {
    this.stateService.previousPage();
  }

  goTo(page: number | string) {
    if (typeof page === 'string') return; // Игнорируем многоточие
    this.stateService.goToPage(page);
  }

  isActive(page: number | string): boolean {
    return typeof page === 'number' && page === this.currentPage();
  }
}
