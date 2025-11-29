import { Component, inject } from '@angular/core';
import { MiniFabBtnComponent } from '../../../../ui-elems/buttons/mini-fab-btn/mini-fab-btn.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-btn',
  imports: [
    MiniFabBtnComponent
  ],
  templateUrl: './profile-btn.component.html',
  styleUrl: './profile-btn.component.scss'
})
export class ProfileBtnComponent {
  private readonly router = inject(Router)

  navigateToProfile() {
    this.router.navigate(['/user'], {
      queryParamsHandling: 'merge'
    })
  }
}
