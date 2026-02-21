import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-h6-title',
  imports: [],
  templateUrl: './h6-title.component.html',
  styleUrl: './h6-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H6TitleComponent {
  text = input.required<string>() // Text that will displayed in the title
}
