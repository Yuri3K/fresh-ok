import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { ShowSearchService } from './show-search.service';

@Component({
  selector: 'app-show-search-btn',
  imports: [MiniFabBtnComponent,],
  templateUrl: './show-search-btn.component.html',
  styleUrl: './show-search-btn.component.scss'
})
export class ShowSearchBtnComponent {
  showSearchService = inject(ShowSearchService)
}
