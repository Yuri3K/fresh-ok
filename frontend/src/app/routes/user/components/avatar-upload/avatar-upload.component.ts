import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AvatarCropDialogComponent } from '../avatar-crop-dialog/avatar-crop-dialog.component';
import { AvatarImageService, DeleteAvatarResponse } from '@core/services/avatar-image.service';
import { InfoDialogComponent } from '@shared/components/dialogs/info-dialog/info-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from "@shared/components/loader/loader.component";
import { BtnIconComponent } from "@shared/ui-elems/buttons/btn-icon/btn-icon.component";
import { DeleteDialogComponent } from '@shared/components/dialogs/delete-dialog/delete-dialog.component';
import { UserAccessService } from '@core/services/user-access.service';

@Component({
  selector: 'app-avatar-upload',
  imports: [
    CommonModule,
    MatIconModule,
    LoaderComponent,
    BtnIconComponent,
    TranslateModule,
  ],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AvatarUploadComponent {
  private readonly dialog = inject(MatDialog)
  private readonly translateService = inject(TranslateService)
  protected readonly imageService = inject(AvatarImageService)
  protected readonly userAccessService = inject(UserAccessService)

  private readonly fileSelector = viewChild.required<ElementRef<HTMLInputElement>>('fileSelector')

  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  isError: boolean = false;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      this.openCropDialog(event)
    }
  }

  private openCropDialog(event: Event) {
    const cropDialog = this.dialog.open(AvatarCropDialogComponent, {
      panelClass: ['crop-dialog', 'green'],
      data: {
        event: event
      }
    })

    cropDialog.afterClosed().subscribe(result => {
      if (result) {
        this.onUpload(result)
      } else {
        this.selectedFile.set(null)
        this.fileSelector().nativeElement.value = '';
      }
    })
  }

  onUpload(blob: Blob): void {
    if (!this.selectedFile) {
      const infoDialog = this.dialog.open(InfoDialogComponent, {
        panelClass: ['green'],
        maxWidth: '700px',
        width: '100vw',
        enterAnimationDuration: '150ms',
        exitAnimationDuration: '150ms',
        data: {
          translations: this.translateService.instant(
            'profile.no-file',
          ),
        },
      })

      infoDialog.afterClosed().subscribe(result => {
        if (result) {
          this.clickInput()
        } else {
          this.selectedFile.set(null)
          this.fileSelector().nativeElement.value = '';
        }
      })

      return;
    }

    this.isUploading.set(true);
    this.isError = false;

    this.imageService.uploadAvatarFromBlob(blob).subscribe({
      next: (response) => {
        this.isError = false;
        this.isUploading.set(false);
        this.selectedFile.set(null); // Очищаем выбранный файл
        this.fileSelector().nativeElement.value = '';

        // this.imageService.setAvatarUrl(response.url) // обновляем аватар после ответа сервера
        this.userAccessService.fetchDbUser().subscribe() // обновляем данные про пользователя на фронте
      },
      error: (error) => {
        console.error('Ошибка загрузки:', error);
        this.isError = true;
        this.isUploading.set(false);
      }
    });
  }

  protected clickInput() {
    const inputEl = this.fileSelector().nativeElement;
    inputEl.click();
  }

  protected deleteAvatar() {
    const deleteDialog = this.dialog.open(DeleteDialogComponent, {
      panelClass: ['green'],
      maxWidth: '700px',
      width: '100vw',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
      data: {
        translations: this.translateService.instant(
          'profile.delete-avatar-dialog',
        ),
        info: null,
      },
    })

    deleteDialog.afterClosed().subscribe(result => {
      if (result) {
        this.isUploading.set(true)
        this.imageService.deleteAvatar().subscribe((result: DeleteAvatarResponse | null) => {
          if(!!result?.success) {
            this.userAccessService.fetchDbUser().subscribe()
          }
          this.isUploading.set(false)
        })
      }
    })
  }
}
