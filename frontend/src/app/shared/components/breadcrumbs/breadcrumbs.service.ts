import { Injectable, signal } from '@angular/core';

export interface Breadcrumb {
  label: string,
  icon?: string,
  url?: string,
  queryParams?: Record<string, string>
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {
  private breadcrumbs = signal<Breadcrumb[]>([])

  breadcrumbs$ = this.breadcrumbs.asReadonly()

  setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
    this.breadcrumbs.set(breadcrumbs)
  }

  addBreadcrumb(breadcrumb: Breadcrumb) {
    this.breadcrumbs.update(current => [...current, breadcrumb])
  }

  clear() {
    this.breadcrumbs.set([])
  }
}
