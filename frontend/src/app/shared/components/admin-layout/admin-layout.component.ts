import { AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from '@core/services/sidebar.service';
import { HeaderComponent } from "../headers/header/header.component";

@Component({
  selector: 'app-admin-layout',
  imports: [
    MatButtonModule,
    MatSidenavModule,
    RouterOutlet,
    HeaderComponent
],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent implements AfterViewInit {
  sidenavContainer = viewChild.required<MatSidenavContainer>(MatSidenavContainer);

  private readonly adminSidenav = viewChild.required<MatSidenav>('adminSidenavMenu')

  protected sidebarService = inject(SidebarService)

  ngAfterViewInit() {
    this.sidebarService.register('admin', this.adminSidenav())
  }
}
