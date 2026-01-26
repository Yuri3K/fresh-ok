import { Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { BreadcrumbsService } from './breadcrumbs.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, pipe } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

export interface Breadcrumb {
  label: string,
  icon?: string,
  url?: string,
  queryParams?: Record<string, string>
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterModule, MatIconModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})

export class BreadcrumbsComponent {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private breadcrumbsService = inject(BreadcrumbsService)

  // Input для статических breadcrumbs
  staticBreadcrumbs = input<Breadcrumb[]>([]);

  homeIcon = input('home')
  homeLabel = input('Homepage')
  homeUrl = input('/')

  // Input для разделителя
  separator = input('chevron_right')

  // Input для автоматической генерации из роутов
  autoGenerate = input(true)

  private navigationEnd$ = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map(() => this.buildBreadcrumbs())
    )

  private autoBreadcrumbs = toSignal(
    this.navigationEnd$,
    { initialValue: this.buildBreadcrumbs() }
  )

  breadcrumbs = computed(() => {
    if (this.staticBreadcrumbs && this.staticBreadcrumbs.length > 0) {
      console.log("STATIC BRCR", this.staticBreadcrumbs)
      return this.addHomeBreadcrumb(this.staticBreadcrumbs())
    }

    const serviceBreadcrumbs = this.breadcrumbsService.breadcrumbs$()
    if (serviceBreadcrumbs.length > 0) {
      console.log('SERVICE BRCR', serviceBreadcrumbs)
      return this.addHomeBreadcrumb(serviceBreadcrumbs)
    }

    if (this.autoGenerate()) {
      console.log("AUTO GENERATED", this.autoGenerate())
      return this.addHomeBreadcrumb(this.autoBreadcrumbs() || [])
    }

    return this.addHomeBreadcrumb([])
  })

  private addHomeBreadcrumb(breadcrumbs: Breadcrumb[]): Breadcrumb[] {
    console.log("🔸 ADD HOME BRCR:", breadcrumbs)
    const home: Breadcrumb = {
      label: this.homeLabel(),
      url: this.homeUrl(),
      icon: this.homeIcon(),
    }

    return [home, ...breadcrumbs]
  }


  private buildBreadcrumbs(): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];
    let route: ActivatedRoute | null = this.route.root;
    const urlSegments: string[] = [];

    while (route) {
      // Собираем URL сегменты
      route.snapshot.url.forEach(segment => {
        urlSegments.push(segment.path);
      });

      // Если есть breadcrumb в data
      if (route.routeConfig?.data?.['breadcrumb']) {
        const breadcrumbData = route.routeConfig.data['breadcrumb'];

        const label = typeof breadcrumbData === 'function'
          ? breadcrumbData(route.snapshot.data, route.snapshot.params)
          : breadcrumbData;

        if (label) {
          const url = urlSegments.length > 0 ? '/' + urlSegments.join('/') : undefined;
          breadcrumbs.push({
            label,
            url
          });
        }
      }
      
      
      route = route.firstChild;
    }
    console.log("🔸 breadcrumbs:", breadcrumbs)
        console.log("🔸 urlSegments:", urlSegments)

    return breadcrumbs;
  }

  isLast(index: number): boolean {
    return index === this.breadcrumbs().length - 1
  }
}
