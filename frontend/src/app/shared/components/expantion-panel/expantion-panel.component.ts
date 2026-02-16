import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { H3TitleComponent } from '../../ui-elems/typography/h3-title/h3-title.component';

@Component({
  selector: 'app-expantion-panel',
  imports: [
    MatExpansionModule,
    H3TitleComponent
  ],
  templateUrl: './expantion-panel.component.html',
  styleUrl: './expantion-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpantionPanelComponent {
  accordion = viewChild.required(MatAccordion);

  title = input.required<string>()
  expanded = input<boolean>(true);
}
