import { Component, inject } from '@angular/core';
import { BannersService } from './services/banners.service';
import { BannerItemComponent } from './banner-item/banner-item.component';

@Component({
  selector: 'app-banners',
  imports: [
    BannerItemComponent,
  ],
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss'
})
export class BannersComponent {
  bannersService = inject(BannersService)
  banners = this.bannersService.banners

}
