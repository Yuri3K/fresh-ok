import { Component, computed, inject, input } from '@angular/core';
import { Badge, Product } from '../../../core/services/products.service';
import {
  Lang,
  LangCode,
  LangsService,
} from '../../../core/services/langs.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MiniFabBtnComponent } from '../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { MEDIA_URL } from '../../../core/urls';

@Component({
  selector: 'app-product-card',
  imports: [MiniFabBtnComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  private readonly langsService = inject(LangsService);

  product = input.required<Product>();
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
