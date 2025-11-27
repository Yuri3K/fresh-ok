import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-h2-title',
  imports: [NgStyle],
  templateUrl: './h2-title.component.html',
  styleUrl: './h2-title.component.scss'
})
export class H2TitleComponent {
  @Input() text!: string // Text that will displayed in the title
  @Input() mb: string = '0' // Margin-bottom for title
  @Input() fz: string = '1.5rem' // Font-size for title
}
