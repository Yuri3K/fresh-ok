import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-h5-title',
  imports: [],
  templateUrl: './h5-title.component.html',
  styleUrl: './h5-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H5TitleComponent {
  @Input() text!: string // Text that will displayed in the title
}
