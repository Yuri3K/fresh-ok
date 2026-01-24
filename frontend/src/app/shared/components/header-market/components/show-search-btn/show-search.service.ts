import { Injectable, signal } from '@angular/core';

// Этот сервис применяется на мобильных экранах, когда основного поля поиска 
// в хэдере нет. В раскрывающемся меню становится доступна кнопка для 
// раскрытия дополнительной секции с поисковым полем
@Injectable()
export class ShowSearchService {
  isSearchVisible = signal(false)
  
  toggleShow() {
    this.isSearchVisible.update(v => !v)
  }

  // show() {
  //   if(this.isSearchVisible()) {
  //     this.close()
  //     return
  //   }

  //   this.isSearchVisible.set(true)
  // }

  close() {
    this.isSearchVisible.set(false)
    // console.log("CLOSE SEARCH", this.isSearchVisible())
  }
}
