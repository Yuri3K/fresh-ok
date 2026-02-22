import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { AvatarUploadComponent } from '../avatar-upload/avatar-upload.component';
import { Breadcrumb, BreadcrumbsService } from '@shared/components/breadcrumbs/breadcrumbs.service';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { UserFormComponent } from "../user-form/user-form.component";
import { H2TitleComponent } from "@shared/ui-elems/typography/h2-title/h2-title.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-profile',
  imports: [
    BreadcrumbsComponent,
    AvatarUploadComponent,
    UserFormComponent,
    H2TitleComponent,
    TranslateModule
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
