import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { HeaderMarketComponent } from '../header-market/header-market.component';

@Component({
  selector: 'app-public-layout',
  imports: [
    HeaderComponent,
    MatButtonModule,
    MatSidenavModule,
    RouterOutlet,
    HeaderMarketComponent,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent {}
