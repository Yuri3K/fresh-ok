import { Component, inject, OnInit } from '@angular/core';
import { LangsService } from '../../core/services/langs.service';
import { filter, take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarUploadComponent } from './components/avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-home',
  imports: [
    TranslateModule,
    AvatarUploadComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly langsService = inject(LangsService)

  ngOnInit() {
    this.getLangs()
  }

  private getLangs() {
    this.langsService.langs$
      .pipe(
        filter(langs => langs.length > 0),
        take(1)
      ).subscribe()
  }

}
