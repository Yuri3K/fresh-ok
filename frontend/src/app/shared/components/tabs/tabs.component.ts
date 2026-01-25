import { Component, contentChildren } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsDirective } from './tabs.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-tabs',
  imports: [MatTabsModule, NgTemplateOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  tabs = contentChildren(TabsDirective)
}
