import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export type SidebarType = 'menu' | 'cart'

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private readonly router = inject(Router)

  // Реестр сайдбаров — имя → ссылка на MatSidenav
  private readonly sidebars = new Map<SidebarType, MatSidenav>()

  // Сигнал активного открытого сайдбара. 
  // Открытым модет быть только один сайдбар
  readonly activeSidenav = signal<SidebarType | null>(null)

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => this.closeAll())
  }

  // Регистрируем сайдбар — вызывается из PublicLayoutComponent
  register(name: SidebarType, sidenav: MatSidenav) {
    this.sidebars.set(name, sidenav)
  }

  open(name: SidebarType) {
    // Закрываем все остальные сайдбары перед открытием нового
    this.sidebars.forEach((sidenav, key) => {
      if(key !== name) sidenav.close()
    })

    const sidenav = this.sidebars.get(name)
    if(sidenav) {
      sidenav.open()
      this.activeSidenav.set(name)
    }
  }

  close(name: SidebarType) {
    const sidenav = this.sidebars.get(name)

    if(sidenav) {
      sidenav.close()
      this.activeSidenav.set(null)
    }
  }

  toggle(name: SidebarType) {
    const sidenav = this.sidebars.get(name)
    if(!sidenav) return

    sidenav.opened
      ? this.close(name)
      : this.open(name)
  }

  closeAll() {
    this.sidebars.forEach(sidenav => sidenav.close())
    this.activeSidenav.set(null)
  }

  isOpen(name: SidebarType) {
    return this.sidebars.get(name)?.opened ?? false
  }





}
