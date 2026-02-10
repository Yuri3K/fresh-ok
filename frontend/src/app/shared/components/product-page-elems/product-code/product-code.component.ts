import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-code',
  imports: [TranslateModule],
  templateUrl: './product-code.component.html',
  styleUrl: './product-code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCodeComponent {
  code = input.required()
}
