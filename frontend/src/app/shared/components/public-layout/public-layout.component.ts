import { AfterViewInit, Component, computed, DestroyRef, inject, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderMarketComponent } from '../header-market/header-market.component';
import { PublicFooterComponent } from '../public-footer/public-footer.component';
import { filter, pairwise, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RestoreScrollService } from '../../../core/services/restore-scroll.service';

@Component({
  selector: 'app-public-layout',
  imports: [
    HeaderComponent,
    MatButtonModule,
    MatSidenavModule,
    RouterOutlet,
    HeaderMarketComponent,
    PublicFooterComponent
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent implements AfterViewInit {
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;
  private scrollService = inject(RestoreScrollService);

  private router = inject(Router)
  private destroyRef = inject(DestroyRef)

  ngAfterViewInit() {
    const scrollableEl = this.sidenavContainer.scrollable.getElementRef().nativeElement;
    // Регистрируем элемент в сервисе
    this.scrollService.setContainer(scrollableEl);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      // pairwise(), //получаем предыдущее и текущее событие навигации
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
        const scrollableElement = this.sidenavContainer.scrollable.getElementRef().nativeElement;
        scrollableElement.scrollTo(0, 0);
    });
  }
}
