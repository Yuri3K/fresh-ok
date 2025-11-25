import { Component } from '@angular/core';
import { AvatarUploadComponent } from './components/avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-user',
  imports: [
    AvatarUploadComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

}
