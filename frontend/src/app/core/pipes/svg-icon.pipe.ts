import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Pipe({
  name: 'matSvgIcon'
})
export class SvgIconPipe implements PipeTransform {

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { }

  transform(url: string): string {
    const randomSuffix = Math.floor(Math.random() * 10000);
    const iconName = url.split('/').pop()?.replaceAll('.svg', '');
    const iconNameId = iconName! + randomSuffix;

    this.iconRegistry.addSvgIcon(
      iconNameId,
      this.sanitizer.bypassSecurityTrustResourceUrl(url),
    );

    return iconNameId;
  }
}