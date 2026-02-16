import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { GetCurrentLangService } from '../../../../../../core/services/get-current-lang.service';
import { Badge } from '@shared/models';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  badge = input.required<Badge>()
  discountPercent = input<number>(0)
  isCart = input(false)

  currentLang = inject(GetCurrentLangService).currentLang
}
