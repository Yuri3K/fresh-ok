import { Component, effect, inject } from '@angular/core';
import { BadgeService } from '../../../../core/services/badge.service';
import { ExpantionPanelComponent } from '../../expantion-panel/expantion-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { GetCurrentLangService } from '../../../../core/services/get-current-lang.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, merge } from 'rxjs';
import { CatalogStateService } from '../../../../core/services/catalog-state.service';

@Component({
  selector: 'app-badge-filter',
  imports: [
    ExpantionPanelComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './badge-filter.component.html',
  styleUrl: './badge-filter.component.scss',
})
export class BadgeFilterComponent {
  private readonly badgesService = inject(BadgeService);
  private readonly stateService = inject(CatalogStateService);
  private readonly route = inject(ActivatedRoute);
  readonly currentLang = inject(GetCurrentLangService).currentLang;
  badges = this.badgesService.badges;

  private readonly _formBuilder = inject(FormBuilder);
  readonly badgeFilter = this._formBuilder.group({
    new: false,
    hit: false,
    discount: false,
  });

  private badgesValues = toSignal(
    this.badgeFilter.valueChanges.pipe(
      debounceTime(300),
      // distinctUntilChanged гарантирует, что если значение формы не изменилось
      // (например, пользователь кликнул чекбокс дважды, вернувшись к прежнему
      // состоянию), то новое событие не пройдёт дальше.
      // Без аргументов (distinctUntilChanged()) он сравнивает значения с помощью
      // строгого равенства (===).Например:
      // of(1, 1, 2, 2, 3, 1).pipe(distinctUntilChanged())
      // Результат будет:
      // 1, 2, 3, 1
      // Потому что ПОДРЯД идущие одинаковые значения отбрасываются.
      // JSON.stringify нужен, потому что badgeFilter.valueChanges эмитит объекты формы.
      // Даже если значения одинаковые, Angular создаёт новый объект → по ссылке они разные.
      // Поэтому обычное === не сработает
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
      ),
    ),
    { initialValue: this.badgeFilter.value },
  );

  constructor() {
    this.initBadgesFromUrl();

    effect(() => {
      const values = this.badgesValues();
      if (values) {
        this.updateQueryParams();
      }
    });
  }

  private initBadgesFromUrl() {
    const badgesParam = this.route.snapshot.queryParamMap.getAll('badge');
    if (!badgesParam.length) return;

    const urlBadges = badgesParam[0].split(',').filter((b) => b);

    if (urlBadges.length > 0) {
      urlBadges.forEach((badge) => {
        const control = this.badgeFilter.get(badge);
        if (control) {
          control.setValue(true, { emitEvent: false });
        }
      });
    }
  }

  private updateQueryParams() {
    const currentBadges = this.badgeFilter.value;

    const selectedBadges = Object.entries(currentBadges)
      .filter(([_, isSelected]) => !!isSelected) // e.g [hit, true]; [new, true]; [discount, false]==> [hit, true]; [new, true]
      .map(([badge, _]) => badge); // e.g [hit, true]; [top, true] ==> [hit, new]

    // Используем метод сервиса, который автоматически сбросит page на 1
    this.stateService.setBadges(selectedBadges);
  }
}
