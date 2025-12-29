import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShowSearchService {
  isSearchVisible = signal(false)
  
  toggleShow() {
    this.isSearchVisible.update(v => !v)
  }
}
