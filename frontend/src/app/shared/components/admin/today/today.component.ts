import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { H1TitleComponent } from "@shared/ui-elems/typography/h1-title/h1-title.component";

@Component({
  selector: 'app-today',
  imports: [
    H1TitleComponent,
    TranslateModule,
    MatCardModule,
    AsyncPipe,
  ],
  templateUrl: './today.component.html',
  styleUrl: './today.component.scss'
})
export class TodayComponent {
  private readonly authService = inject(AuthService);

  // Get current Date
  get todayDate() {
    return new Date();
  }

  // Get data for current User
  get currentUser$() {
    return this.authService.user$;
  }

  day!: number;
  weekday!: string;
  month!: string;

  ngOnInit() {
    this.setTodayDate();
  }

  // Get 
  setTodayDate() {
    // Get current day of the month (1–31)
    this.day = this.todayDate.getDate();

    // Get abbreviated weekday name (e.g., Mon, Tue)
    this.weekday = this.todayDate.toLocaleDateString('en-US', { weekday: 'short' });

    // Get full month name (e.g., January, February)
    this.month = this.todayDate.toLocaleDateString('en-US', { month: 'long' });
  }
}
