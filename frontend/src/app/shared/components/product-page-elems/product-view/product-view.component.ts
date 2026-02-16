import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-view',
  imports: [],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductViewComponent {

}
