import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-h3-title',
  imports: [],
  templateUrl: './h3-title.component.html',
  styleUrl: './h3-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H3TitleComponent {
  @Input() text!: string // Text that will displayed in the title
}
