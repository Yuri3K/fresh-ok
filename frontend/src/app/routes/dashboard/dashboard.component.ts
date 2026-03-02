import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    BtnFlatComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {

}
