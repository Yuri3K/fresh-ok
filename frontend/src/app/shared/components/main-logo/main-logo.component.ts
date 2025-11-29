import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SvgIconPipe } from "../../../core/pipes/svg-icon.pipe";

@Component({
  selector: 'app-main-logo',
  templateUrl: './main-logo.component.html',
  styleUrl: './main-logo.component.scss',
  imports: [
    RouterModule,
    TranslateModule,
    MatIconModule,
    SvgIconPipe
  ],
})

export class MainLogoComponent {
  logoUrl = '/assets/images/logo-green.svg'
}