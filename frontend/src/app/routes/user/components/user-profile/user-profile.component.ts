import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { AvatarUploadComponent } from '../avatar-upload/avatar-upload.component';
import { Breadcrumb, BreadcrumbsService } from '@shared/components/breadcrumbs/breadcrumbs.service';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-user-profile',
  imports: [
    BreadcrumbsComponent,
    AvatarUploadComponent,

  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  private readonly breadcrumbsService = inject(BreadcrumbsService)

  constructor() {
    effect(() => {
      const brcrs = this.breadcrumbsService.brcrTranslations()

      if (brcrs) {
        const breadcrumbs: Breadcrumb[] = [
          {
            label: brcrs.homepage.name,
            url: brcrs.homepage.url,
            icon: 'home',
          },
          {
            label: brcrs.user.name,
          },
        ]
        this.breadcrumbsService.setBreadcrumbs(breadcrumbs)
      }
    })
  }
}
