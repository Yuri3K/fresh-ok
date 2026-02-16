import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, viewChild, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderMarketComponent } from '../header-market/header-market.component';
import { PublicFooterComponent } from '../public-footer/public-footer.component';
import { filter} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RestoreScrollService } from '../../../core/services/restore-scroll.service';
import { SidebarService } from '@core/services/sidebar.service';
import { SidenavMenuComponent } from '../sidenav-menu/sidenav-menu.component';
import { SidenavCartComponent } from '../sidenav-cart/sidenav-cart.component';

@Component({
  selector: 'app-public-layout',
  imports: [
    HeaderComponent,
    MatButtonModule,
    MatSidenavModule,
    RouterOutlet,
    HeaderMarketComponent,
    PublicFooterComponent,
    SidenavMenuComponent,
    SidenavCartComponent,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent implements AfterViewInit {
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;

  sidenavMenu = viewChild.required<MatSidenav>('sidenavMenu')
  sidenavCart = viewChild.required<MatSidenav>('sidenavCart')

  private readonly scrollService = inject(RestoreScrollService);
  private readonly sidebarService = inject(SidebarService)

  private router = inject(Router)
  private destroyRef = inject(DestroyRef)

  ngAfterViewInit() {
    // Регистрируем оба сайдбара в сервисе
    this.sidebarService.register('menu', this.sidenavMenu())
    this.sidebarService.register('cart', this.sidenavCart())

    // Скролл
    const scrollableEl = this.sidenavContainer.scrollable.getElementRef().nativeElement;
    // Регистрируем элемент в сервисе
    this.scrollService.setContainer(scrollableEl);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
        const scrollableElement = this.sidenavContainer.scrollable.getElementRef().nativeElement;
        scrollableElement.scrollTo(0, 0);
    });
  }
}
