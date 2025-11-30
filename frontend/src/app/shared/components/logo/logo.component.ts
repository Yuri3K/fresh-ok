import { Component, Input, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SvgIconPipe } from "../../../core/pipes/svg-icon.pipe";

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  imports: [
    RouterModule,
    TranslateModule,
    MatIconModule,
    SvgIconPipe
  ],
})

export class LogoComponent {
  logoUrl = 'assets/images/logo-white.svg'

}