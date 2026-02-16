import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-h4-title',
  imports: [],
  templateUrl: './h4-title.component.html',
  styleUrl: './h4-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H4TitleComponent {
  @Input() text!: string // Text that will displayed in the title
}