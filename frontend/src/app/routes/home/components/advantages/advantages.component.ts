import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { SvgIconPipe } from '../../../../core/pipes/svg-icon.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-advantages',
  imports: [
    SvgIconPipe,
    TranslateModule,
    MatIconModule
  ],
  templateUrl: './advantages.component.html',
  styleUrl: './advantages.component.scss'
})
export class AdvantagesComponent {
  mediaUrl = environment.cloudinary_url
  
  ngOnInit() {
    console.log("🚀 ~ mediaUrl:", this.mediaUrl)
    
  }
}
