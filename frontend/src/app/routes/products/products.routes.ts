import { Data, Params, Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    // Так как в BreadcrumbsComponent автогенерация хлебных крошках 
    // отключена (autoGenerate = input(false)) из-за невозможности 
    // обеспечить мгновенную мультиязычность (перевод для названия продукта 
    // доступен только после получения продукта с сервера. Можно было добавить
    // resolver, но это плохой UI. Пользователь не поймет почему задержка после 
    // клика на корточку товара). Поэтому сейчас data: {...} не выполняет никакой роли
    // Она оставлена только для прммера. 
    data: { breadcrumb: 'products' },
    children: [
      {
        path: '',
        loadComponent: () => import('./products.component').then(m => m.ProductsComponent),
      },
      {
        path: ':slug',
        loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        // Так как в BreadcrumbsComponent автогенерация хлебных крошках 
        // отключена (autoGenerate = input(false)) из-за невозможности 
        // обеспечить мгновенную мультиязычность (перевод для названия продукта 
        // доступен только после получения продукта с сервера. Можно было добавить
        // resolver, но это плохой UI. Пользователь не поймет почему задержка после 
        // клика на корточку товара). Поэтому сейчас data: {...} не выполняет никакой роли
        // Она оставлена только для прммера. 
        data: {
          breadcrumb: (data: Data, params: Params) => {
            return params['slug']
          }
          // Пояснения про data: Data. Для удобаства будем называть dataParameter: Data
          // Что попадает в dataParameter?
          // Например, если в маршрут передана такая data
          // data: {
          //  breadcrumb: (dataParameter: Data, params: Params) => {
          //  ...
          //  }
          //  title: "Product Page"
          //  customValue: 123
          // }
          // То в dataParameter будет передан объект 
          // { title: "Product Page", customValue: 123, breadcrumb: (...) => ...}
          // Итого: dataParameter = всё из data: {...} конфига роута + результаты resolvers.
          // 
          // Более детально (дополняем). Если в маршруте есть resolver
          // {
          //  path: ':slug',
          //  resolve: { product: productResolver },  // попадет в data
          //  data: { 
          //    title: 'Product Page',  // попадет в 
          //    customValue: 123        // попадет в data['customValue']
          //    breadcrumb: (dataParameter: Data, params: Params) => {
          //      console.log(dataParameter['product']) - из resolver (product - если 
          //                                            resolver вернул объект product)
          //      console.log(dataParameter['title']) - то, что в data['title']
          //      console.log(dataParameter['customValue']) - то, что в data['customValue']
          //      console.log(dataParameter['breadcrumb']) - то, что в data['breadcrumb'] - ТО
          //                                  ЕСТЬ ФУНКЦИЯ ДОСТУПНА В САМОЙ СЕБЕ!!!
          //    }
          //  }
          // }
        }
      }
    ]
  },
]