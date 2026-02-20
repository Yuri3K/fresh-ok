import { ChangeDetectionStrategy, Component, computed, HostListener, inject, input, output } from '@angular/core';
import { BtnIconComponent } from '../../../../../../ui-elems/buttons/btn-icon/btn-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'firebase/auth';
import { MatCardModule } from '@angular/material/card';
import { BtnFlatComponent } from '../../../../../../ui-elems/buttons/btn-flat/btn-flat.component';
import { MatIconModule } from '@angular/material/icon';
import { UserAccessService } from '../../../../../../../core/services/user-access.service';
import { AsyncPipe } from '@angular/common';
import { MEDIA_URL } from '../../../../../../../core/urls';
import { toSignal } from '@angular/core/rxjs-interop';
import { DbUser } from '@shared/models';

@Component({
  selector: 'app-avatar-popup',
  imports: [
    BtnIconComponent,
    BtnFlatComponent,
    MatCardModule,
    TranslateModule,
    MatIconModule,
],
  templateUrl: './avatar-popup.component.html',
  styleUrl: './avatar-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPopupComponent {
  authUser = input.required<User>()
  dbUser = input.required<DbUser>()
  imgUrl = input.required<string | null>()

  closePopup = output<void>()
  logout = output<void>()

  readonly privacyLink = 'https://policies.google.com/privacy?hl=en'
  readonly termsLink = 'https://policies.google.com/terms?hl=en'

  readonly mediaUrl = MEDIA_URL

  // c_fill — обрезать под квадрат без искажений
  // g_face — определить и центрировать на лице
  // w_300,h_300 — размер 300×300
  // readonly avatarMeta = 'f_auto,q_auto,c_thumb,g_face,r_max,w_100,h_100/'
  // readonly avatarMeta = 'c_thumb,g_face,r_max,w_200,h_200/'


  @HostListener('document:click', ['$event'])
  onClickInside(event: PointerEvent) {
    const target = event.target as HTMLElement
    if(!target.closest('app-avatar-popup')) {
      this.closePopup.emit()
    }
  }

  // protected imgUrl = computed(() => {
  //   if(this.dbUser()?.avatarVersion && this.dbUser()?.avatarId) {
  //     return `${this.mediaUrl}v${this.dbUser()!.avatarVersion}/${this.dbUser()!.avatarId}`
  //   } else {
  //     return this.mediaUrl + this.dbUser()!.avatarId
  //   }
  // })
}

