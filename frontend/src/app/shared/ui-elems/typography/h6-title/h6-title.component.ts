import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-h6-title',
  imports: [NgStyle],
  templateUrl: './h6-title.component.html',
  styleUrl: './h6-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H6TitleComponent {
  @Input() text!: string // Text that will displayed in the title
  @Input() mb: string = '0' // Margin-bottom for title
  @Input() fz: string = '0.875rem' // Font-size for title
  @Input() fw: string = '500' // Font-size for title
}
