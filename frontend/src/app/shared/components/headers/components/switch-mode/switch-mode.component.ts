import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BtnIconComponent } from '@shared/ui-elems/buttons/btn-icon/btn-icon.component';
import { SwitchModeService } from '@core/services/switch-mode.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-switch-mode',
  imports: [BtnIconComponent, AsyncPipe, MatTooltipModule, TranslateModule],
  templateUrl: './switch-mode.component.html',
  styleUrl: './switch-mode.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchModeComponent {
  readonly switchModeService = inject(SwitchModeService);
  readonly isDarkTheme$ = this.switchModeService.isDarkTheme$;
}
