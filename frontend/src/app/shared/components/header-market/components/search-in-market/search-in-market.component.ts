import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { BtnIconComponent } from '../../../../ui-elems/buttons/btn-icon/btn-icon.component';

@Component({
  selector: 'app-search-in-market',
  imports: [
    TranslateModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    BtnIconComponent
  ],
  templateUrl: './search-in-market.component.html',
  styleUrl: './search-in-market.component.scss'
})
export class SearchInMarketComponent {

  searchField = new FormControl('')

  onSubmit() {

  }

  clearInput(){
    this.searchField.setValue('')
  }
}
