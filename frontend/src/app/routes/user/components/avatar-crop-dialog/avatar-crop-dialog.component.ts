import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { H2TitleComponent } from '../../../../shared/ui-elems/typography/h2-title/h2-title.component';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage, ImageTransform } from 'ngx-image-cropper';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { BtnRaisedComponent } from '../../../../shared/ui-elems/buttons/btn-raised/btn-raised.component';

@Component({
  selector: 'app-avatar-crop-dialog',
  imports: [
    H2TitleComponent,
    ImageCropperComponent,
    MatDialogContent,
    MatDialogActions,
    BtnRaisedComponent,
  ],
  templateUrl: './avatar-crop-dialog.component.html',
  styleUrl: './avatar-crop-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarCropDialogComponent {
  imageChangedEvent: Event | null = null;
  croppedEvent!: ImageCroppedEvent
  // croppedImage: SafeUrl = '';

  // private readonly sanitizer = inject(DomSanitizer)
  private readonly data = inject(MAT_DIALOG_DATA)
  private readonly dialogRef = inject(MatDialogRef)
  transform: ImageTransform = {scale : 1}

  ngOnInit() {
    this.imageChangedEvent = this.data.event
  }

  crop() {
    this.dialogRef.close(this.croppedEvent.blob)
  }

  onWheel(event: WheelEvent) {
    console.log("WHEEL")
    event.preventDefault()
    const delta = event.deltaY > 0 ? -0.05 : 0.05;
    console.log("🔸 delta:", delta)
    this.transform = {
      ...this.transform,
      scale: Math.min(5, Math.max(0.5, (this.transform.scale ?? 1) + delta))
    }
    console.log("🔸 this.transform:", this.transform)
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedEvent = event
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
