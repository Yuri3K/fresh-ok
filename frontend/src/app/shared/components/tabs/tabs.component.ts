import { ChangeDetectionStrategy, Component, contentChildren, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsDirective } from './tabs.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-tabs',
  imports: [MatTabsModule, NgTemplateOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  tabs = contentChildren(TabsDirective)

  selectedIndex = signal(0)

  onTabChange(index: number) {
    this.selectedIndex.set(index)
  }
}
