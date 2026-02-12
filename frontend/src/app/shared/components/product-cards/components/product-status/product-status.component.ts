import { Component, inject, input } from '@angular/core';
import { GetCurrentLangService } from '../../../../../core/services/get-current-lang.service';
import { Stock } from '@shared/models';

@Component({
  selector: 'app-product-status',
  imports: [],
  templateUrl: './product-status.component.html',
  styleUrl: './product-status.component.scss'
})
export class ProductStatusComponent {
  currentLang = inject(GetCurrentLangService).currentLang
  status = input.required<Stock>()
}
