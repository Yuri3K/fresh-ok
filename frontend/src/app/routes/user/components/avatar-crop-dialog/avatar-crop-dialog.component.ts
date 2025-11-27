import { Component } from '@angular/core';
import { H2TitleComponent } from '../../../../shared/ui-elems/typography/h2-title/h2-title.component';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-avatar-crop-dialog',
  imports: [
    H2TitleComponent,
    ImageCropperComponent,
  ],
  templateUrl: './avatar-crop-dialog.component.html',
  styleUrl: './avatar-crop-dialog.component.scss'
})
export class AvatarCropDialogComponent {
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    if(typeof event.objectUrl === 'string') {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    }
    
    // event.blob can be used to upload the cropped image
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
