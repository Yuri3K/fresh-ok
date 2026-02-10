import { Component, inject, input } from '@angular/core';
import { Badge } from '../../../../../../core/services/products.service';
import { GetCurrentLangService } from '../../../../../../core/services/get-current-lang.service';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  badge = input.required<Badge>()
  discountPercent = input<number>(0)

  currentLang = inject(GetCurrentLangService).currentLang
}
