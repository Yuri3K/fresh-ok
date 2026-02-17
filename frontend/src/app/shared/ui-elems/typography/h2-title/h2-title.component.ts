import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-h2-title',
  imports: [],
  templateUrl: './h2-title.component.html',
  styleUrl: './h2-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H2TitleComponent {
  text = input.required<string>() // Text that will displayed in the title
}
