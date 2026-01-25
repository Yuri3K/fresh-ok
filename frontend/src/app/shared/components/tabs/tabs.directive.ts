import { Directive, inject, input, TemplateRef } from "@angular/core";

@Directive({
  selector: '[appTabs]'
})

export class TabsDirective {
  appTabs = input.required<string>()

  tempalte = inject(TemplateRef<any>)
}