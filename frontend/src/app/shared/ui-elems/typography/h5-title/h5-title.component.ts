import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-h5-title',
  imports: [],
  templateUrl: './h5-title.component.html',
  styleUrl: './h5-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H5TitleComponent {
  text = input.required<string>() // Text that will displayed in the title
}
