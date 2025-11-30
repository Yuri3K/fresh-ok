import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';

@Component({
  selector: 'app-admin-btn',
  imports: [MiniFabBtnComponent],
  templateUrl: './admin-btn.component.html',
  styleUrl: './admin-btn.component.scss',
})
export class AdminBtnComponent {
  private readonly router = inject(Router);

  navigateToAdmin() {
    this.router.navigate(['/admin'], {
      queryParamsHandling: 'merge',
    });
  }
}
