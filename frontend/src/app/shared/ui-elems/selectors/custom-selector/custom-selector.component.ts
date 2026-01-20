import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OpenMenuDirective } from '../../../../core/directives/open-menu.directive';

@Component({
  selector: 'app-custom-selector',
  imports: [
    MatButtonModule,
    MatIconModule,
    OpenMenuDirective,
  ],
  templateUrl: './custom-selector.component.html',
  styleUrl: './custom-selector.component.scss'
})
export class CustomSelectorComponent {
  text = input.required()
  iconNameLeft = input('')
  iconNameRigth = input('')
  ariaLabel = input('')
}
