import { Component, computed } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { HeaderMarketComponent } from '../header-market/header-market.component';
import { PublicFooterComponent } from '../public-footer/public-footer.component';

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
export class PublicLayoutComponent  {
  // @ViewChild('headerMain', { read: ElementRef }) headerMainRef!: ElementRef
  // @ViewChild('headerMarket', { read: ElementRef }) headerMarketRef!: ElementRef
  // private resizeObserver!: ResizeObserver

  // private headerMainHeight = signal(0)
  // private headerMarketHeight = signal(0)

  sidenavHeight = computed(() => {
    // const headersHeight = this.headerMainHeight() + this.headerMarketHeight()
    // return `calc(100% - ${headersHeight}px)`
  })

  ngOnInit() {

    // this.watchHeaderHeight()
  }

  ngAfterViewInit() {
    // this.resizeObserver.observe(this.headerMainRef.nativeElement)
    // this.resizeObserver.observe(this.headerMarketRef.nativeElement)
  }
  
  // private watchHeaderHeight() {
  //   this.resizeObserver = new ResizeObserver((entries) => {
  //     const headerMainHeight = entries[0].contentRect.height
  //     const headerMarketHeight = entries[0].contentRect.height
  
  //     this.headerMainHeight.set(headerMainHeight)
  //     this.headerMarketHeight.set(headerMarketHeight)
  //   })
  // }

  ngOnDestroy() {
    // this.resizeObserver?.disconnect()
  }
}
