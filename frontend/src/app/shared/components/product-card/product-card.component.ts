import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../../core/services/products.service';
import {
  Lang,
  LangCode,
  LangsService,
} from '../../../core/services/langs.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MiniFabBtnComponent } from '../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { MEDIA_URL } from '../../../core/urls';
import { RouterLink } from '@angular/router';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  imports: [
    MiniFabBtnComponent,
    RouterLink,
    MatFormField,


    MatFormFieldModule, MatInputModule, FormsModule,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  withStockAndRate = input(true)
  product = input.required<Product>();

  private readonly langsService = inject(LangsService);

  value = '1';

  imgUrl = computed(() => {
    return MEDIA_URL + this.product().publicId
  })

  currentLang = toSignal<LangCode>(
    this.langsService.currentLang$.pipe(
      filter((lang): lang is Lang => !!lang),
      map((lang) => lang.browserLang)
    ),
    {
      requireSync: true,
    }
  );
}
