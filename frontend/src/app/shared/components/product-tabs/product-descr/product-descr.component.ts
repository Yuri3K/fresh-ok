import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-product-descr',
  imports: [],
  templateUrl: './product-descr.component.html',
  styleUrl: './product-descr.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDescrComponent {
  descr = input.required<string>()

  content = computed(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(this.descr(), 'text/html')
    
    return Array.from(doc.querySelectorAll('p')).map(par => par.textContent?.trim() || '')
  })
}
