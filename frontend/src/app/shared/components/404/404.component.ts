import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-404',
  templateUrl: './404.component.html',
  styleUrl: './404.component.scss',
  imports: [
    RouterLink,
    TranslateModule
  ],
})

export class Error404Component {

}