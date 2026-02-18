import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

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
  private readonly translateService = inject(TranslateService)

  private breadcrumbs = signal<Breadcrumb[]>([])

  breadcrumbs$ = this.breadcrumbs.asReadonly()

  brcrTranslations = toSignal(
    this.translateService.stream('breadcrumbs'),
    { initialValue: null }
  )

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
