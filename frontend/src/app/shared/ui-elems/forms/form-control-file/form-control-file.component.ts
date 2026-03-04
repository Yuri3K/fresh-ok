import { Component, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DragDropDirective } from './drag-drop.directive';
import { FormControl } from '@angular/forms';
import { SnackbarService } from '@core/services/snackbar.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BtnFlatComponent } from "@shared/ui-elems/buttons/btn-flat/btn-flat.component";

@Component({
  selector: 'app-form-control-file',
  imports: [
    MatCardModule,
    MatIconModule,
    TranslateModule,
    DragDropDirective,
    BtnFlatComponent
],
  templateUrl: './form-control-file.component.html',
  styleUrl: './form-control-file.component.scss'
})
export class FormControlFileComponent {
  fileControl = input.required<FormControl<File | null>>()

  private readonly snackbarService = inject(SnackbarService)
  private readonly translateService = inject(TranslateService)

  protected readonly imageUrl = signal('')

  onFilesDropped(event: FileList | Event) {
    let file: File | null = null

    if (event instanceof FileList) {
      file = event[0]
    } else if (event instanceof Event) {
      const target = event.target as HTMLInputElement
      if (target?.files) {
        file = target?.files[0]
      }
    }

    // --- ПРОВЕРКА ЧТО ВЫБРАНА ИМЕННО КАРТИНКА ---
    if (file && !file.type.startsWith('image/')) {
      const message = this.translateService.instant('common.forms.file.invalid-type');
      this.snackbarService.openSnackBar(message);

      // Очищаем инпут, если там был неверный файл
      this.fileControl().setValue(null);
      this.imageUrl.set('');
      return; // Прерываем выполнение
    }
    // ----------------------

    this.fileControl().setValue(file)
    this.showImage(file)
  }

  private showImage(file: File | null) {
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      this.imageUrl.set(reader.result as string)
      console.log("🚀 ~ this.imageUrl:", this.imageUrl())
    }

    reader.onerror = error => {
      const message = this.translateService.instant('common.forms.file.reader-error')
      this.snackbarService.openSnackBar(message)

      console.log("[FormControlFileComponent] showImage error", error)
    }
  }

}
