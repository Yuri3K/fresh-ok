import { Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { BreadcrumbsService } from './breadcrumbs.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map } from 'rxjs';
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
  separator = input('chevron_right') // Input для разделителя

  // Input для автоматической генерации из роутов. То есть в роуте нужно будет передавать
  //
  // path: '',
  // data: {breadcrumb: 'products'},
  // children: [...
  //
  // или 
  //
  //{
  //   path: ':slug',
  //   loadComponent: () => import('./components/product-detail/product-detail.component')
  //      .then(m => m.ProductDetailComponent),
  //   data: {
  //     breadcrumb: (data: Data, params: Params) => {
  //       return params['slug']
  //     }
  //   }
  // }
  //
  // чтобы хлебные крошки автоматически отпредилялись
  autoGenerate = input(false)

  // Отслеживаем событие завершения навигации и вызываем метод 
  // автоматческого постовения хлебных крошек. Отслеживается
  // только если autoGenerate будет true
  private navigationEnd$ = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map(() => this.buildBreadcrumbs())
    )

  // Хранит в себе результат выполнения метода buildBreadcrumbs, который 
  // запустится после завершения навигации. Работает только если autoGenerate 
  // будет true
  private autoBreadcrumbs = toSignal(
    this.navigationEnd$,
    { initialValue: this.buildBreadcrumbs() }
  )

  // Хранит в себе ХЛЕБНЫЕ КРОШКИ.
  breadcrumbs = computed(() => {
    // Если выбран режим статических хлебных крошек. То есть в app-breadcrumbs
    // просто будет передан массив по типу Breadcrumb[]
    if (this.staticBreadcrumbs && this.staticBreadcrumbs.length > 0) {
      // console.log("STATIC BRCR", this.staticBreadcrumbs)
      return this.addHomeBreadcrumb(this.staticBreadcrumbs())
    }

    // Если хлебные крошки будут добавлять при помоши сервиса BreadcrumbsService.
    // То есть если в сервисе BreadcrumbsService breadcrumbs$ будет не пустой,
    // то с него будут считываться данные 
    const serviceBreadcrumbs = this.breadcrumbsService.breadcrumbs$()
    if (serviceBreadcrumbs.length > 0) {
      // console.log('SERVICE BRCR', serviceBreadcrumbs)
      return serviceBreadcrumbs
      // return this.addHomeBreadcrumb(serviceBreadcrumbs)
    }

    // Если autoGenerate равен true, то хлебные крошки будут сформированы 
    // с роута. В этом режиме вся цепочка роутов должна содержать в себе 
    // данные data: {breadcrumb: ...}
    if (this.autoGenerate()) {
      // console.log("AUTO GENERATED", this.autoGenerate())
      return this.addHomeBreadcrumb(this.autoBreadcrumbs() || [])
    }

    return this.addHomeBreadcrumb([])
  })

  private addHomeBreadcrumb(breadcrumbs: Breadcrumb[]): Breadcrumb[] {
    // console.log("🔸 ADD HOME BRCR:", breadcrumbs)
    const home: Breadcrumb = {
      label: this.homeLabel(),
      url: this.homeUrl(),
      icon: this.homeIcon(),
    }

    return [home, ...breadcrumbs]
  }



  // Метод предназначен для автоматического построения хлебных крошек (breadcrumbs) 
  // на основе текущего состояния роутинга в Angular. Он проходит по всем вложенным 
  // маршрутам и формирует массив объектов Breadcrumb[], где каждый элемент содержит 
  // label и url.
  //
  // Используется цикл while (route), который начинается с корневого маршрута (this.route.root).
  // В конце каждой итерации выполняется переход к дочернему маршруту: route = route.firstChild;
  // Таким образом, происходит глубокий обход дерева роутов от верхнего уровня (AppComponent) 
  // до самого вложенного маршрута.
  //
  // На каждой итерации:
  // route.snapshot.url.forEach(segment => { urlSegments.push(segment.path); });
  // Все сегменты текущего маршрута добавляются в массив urlSegments. В итоге 
  // формируется полный путь до текущего уровня вложенности.
  //
  // У каждого маршрута может быть объект data, где задаётся свойство breadcrumb
  // if (route.routeConfig?.data?.['breadcrumb']) { ... }
  // Если свойство есть, значит этот маршрут участвует в построении хлебных крошек.
  //
  // Формирование label.
  // breadcrumb может быть:
  // строкой/объектом → используется напрямую как label или
  // функцией → вызывается с параметрами route.snapshot.data и 
  // route.snapshot.params, чтобы динамически вычислить label.
  // Пример:
  // const label = typeof breadcrumbData === 'function' 
  // ? breadcrumbData(route.snapshot.data, route.snapshot.params) 
  // : breadcrumbData;
  //
  // Формирование URL
  // Если удалось получить label, то формируется URL. URL собирается из 
  // всех накопленных сегментов.
  // const url = urlSegments.length > 0 ? '/' + urlSegments.join('/') : undefined;
  //
  // Каждый корректный элемент добавляется в итоговый массив:
  // breadcrumbs.push({ label, url });
  private buildBreadcrumbs(): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];

    // Получаем корневой роут
    let route: ActivatedRoute | null = this.route.root;

    // Накапливаем сегменты в каждой итерации
    const urlSegments: string[] = [];

    while (route) {
      // Собираем URL сегменты с конкретной итерации
      route.snapshot.url.forEach(segment => {
        urlSegments.push(segment.path);
      });

      // Если есть breadcrumb в data
      if (route.routeConfig?.data?.['breadcrumb']) {
        // Получаем данные которые были переданы в мершруте для breadcrumb
        // data: {breadcrumb: ...}. Может быть просто объектом, а может быть
        // и функцией. В зависимости от того, что передали в маршруте
        const breadcrumbData = route.routeConfig.data['breadcrumb'];

        // В мершруте можно передать как простой объект для breadcrumb для label, 
        // так и функцию, которая будет расчитывать нужный label на основе 
        // переданных параметров

        const label = typeof breadcrumbData === 'function'
          ? breadcrumbData(route.snapshot.data, route.snapshot.params)
          : breadcrumbData;

        // Если из маршрута получен label
        if (label) {
          // Формируем url из накопленных сегментов
          const url = urlSegments.length > 0 ? '/' + urlSegments.join('/') : undefined;
          // Добавляем в массив breadcrumbs собранные данные
          breadcrumbs.push({
            label,
            url
          });
        }
      }

      route = route.firstChild;
    }

    return breadcrumbs;
  }

  isLast(index: number): boolean {
    return index === this.breadcrumbs().length - 1
  }
}
