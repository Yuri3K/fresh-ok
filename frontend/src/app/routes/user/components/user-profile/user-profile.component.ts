import { Component } from '@angular/core';
import { AvatarUploadComponent } from '../avatar-upload/avatar-upload.component';
import { AvatarCropDialogComponent } from '../avatar-crop-dialog/avatar-crop-dialog.component';

@Component({
  selector: 'app-user-profile',
  imports: [
    AvatarUploadComponent,
    AvatarCropDialogComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

}
