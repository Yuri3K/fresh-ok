import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SwitchModeService } from '../../../../../core/services/switch-mode.service';
import { AsyncPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BtnIconComponent } from '../../../../ui-elems/buttons/btn-icon/btn-icon.component';

@Component({
  selector: 'app-switch-mode',
  imports: [BtnIconComponent, AsyncPipe, MatTooltipModule],
  templateUrl: './switch-mode.component.html',
  styleUrl: './switch-mode.component.scss',
})
export class SwitchModeComponent {
  readonly switchModeService = inject(SwitchModeService);
  readonly isDarkTheme$ = this.switchModeService.isDarkTheme$;
}
