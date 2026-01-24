import { Injectable, signal } from '@angular/core';

// Этот сервис применяется на мобильных экранах, когда основной кнопки для раскрытия 
// каталога товаров в хэдере нет. В раскрывающемся меню становится доступна кнопка для 
// раскрытия дополнительной секции с каталогом
@Injectable()
export class ShowCatalogService {
  isCatalogVisible = signal(false)

  toggleShow() {
    this.isCatalogVisible.update(v => !v)
  }

  // show() {
  //   if (this.isCatalogVisible()) {
  //     this.close()
  //     return
  //   }

  //   this.isCatalogVisible.set(true)
  // }

  close() {
    this.isCatalogVisible.set(false)
    // console.log("CLOSE CATALOG", this.isCatalogVisible())
  }
}
