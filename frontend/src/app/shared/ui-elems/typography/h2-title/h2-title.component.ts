import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-h2-title',
  imports: [],
  templateUrl: './h2-title.component.html',
  styleUrl: './h2-title.component.scss'
})
export class H2TitleComponent {
  @Input() text!: string // Text that will displayed in the title
}
