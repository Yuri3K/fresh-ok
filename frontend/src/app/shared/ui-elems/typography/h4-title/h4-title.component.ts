import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-h4-title',
  imports: [],
  templateUrl: './h4-title.component.html',
  styleUrl: './h4-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H4TitleComponent {
  text = input.required<string>() // Text that will displayed in the title
}