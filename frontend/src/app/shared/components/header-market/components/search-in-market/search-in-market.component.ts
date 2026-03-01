import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { BtnIconComponent } from '../../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { ApiService } from '@core/services/api.service';
import { LangRouterService } from '@core/services/langs/lang-router.service';
import { Product } from '@shared/models';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
import { MEDIA_URL } from '@core/urls';
import { LoaderComponent } from "@shared/components/loader/loader.component";

@Component({
  selector: 'app-search-in-market',
  imports: [
    TranslateModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    BtnIconComponent,
    LoaderComponent
],
  templateUrl: './search-in-market.component.html',
  styleUrl: './search-in-market.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInMarketComponent {
  private readonly apiService = inject(ApiService)
  private readonly navigateService = inject(LangRouterService)
  protected readonly currentLang = inject(GetCurrentLangService).currentLang

  protected readonly searchField = new FormControl('')

  // Результаты поиска
  protected readonly searchResults = signal<Product[]>([])
  protected readonly isSearching = signal(false)
  protected readonly showDropdown = signal(false)

  protected readonly mediaUrl = MEDIA_URL

  constructor() {
    // Подписываемся на изменения в поле поиска
    this.searchField.valueChanges
      .pipe(
        debounceTime(300), // Ждём 300мс после последнего ввода
        distinctUntilChanged(), // Только если значение изменилось
        switchMap(query => {
          // Если пустой запрос — не делаем запрос
          if (!query || query.trim().length < 2) {
            this.showDropdown.set(false)
            return of([])
          }

          this.isSearching.set(true)
          this.showDropdown.set(true)

          // Запрос на сервер с поиском
          return this.apiService
            .get<{ data: Product[] }>('/products', [
              `search=${encodeURIComponent(query.trim())}`,
              // 'limit=5' // Ограничиваем 5 результатами для автокомплита
            ])
            .pipe(
              catchError(() => {
                this.isSearching.set(false)
                return of({ data: [] })
              })
            )
        }),
        takeUntilDestroyed()
      )
      .subscribe(response => {
        console.log("🚀 ~ response:", response)
        if('data' in response ) {
          this.searchResults.set(response.data || [])
        }
        this.isSearching.set(false)
      })
  }

  onSubmit() {
    const query = this.searchField.value?.trim()

    if (!query) return

    // Переход на страницу поиска со всеми результатами
    this.navigateService.navigate(['/products'], {
      queryParams: { search: query }
    })

    // Закрываем dropdown
    this.showDropdown.set(false)
  }

  selectProduct(product: Product) {
    // Переход на страницу товара
    this.navigateService.navigate(['/products', product.slug])

    // Закрываем dropdown и очищаем поле
    this.showDropdown.set(false)
    this.searchField.setValue('')
  }

  // Закрываем dropdown при клике вне компонента
  closeDropdown() {
    setTimeout(() => this.showDropdown.set(false), 200)
  }

  clearInput() {
    this.searchField.setValue('')
    this.showDropdown.set(false)
  }
}
