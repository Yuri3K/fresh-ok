import { NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: 'app-h1-title',
  standalone: true,
  templateUrl: './h1-title.component.html',
  styleUrl: './h1-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle]
})

export class H1TitleComponent{
  text = input.required<string>() // Text that will displayed in the title
  mb = input<string>('24px') // Margin-bottom for title
  fz = input<string>('3rem') // Font-size for title
}