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

  close() {
    this.isSearchVisible.set(false)
  }
}
