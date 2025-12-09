import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, inject } from '@angular/core';

@Directive({
  // Изменяем селектор, чтобы это была атрибутивная директива, а не структурная.
  selector: '[ngxCarouselCloneRenderContent]', 
  standalone: true
})
export class NgxCarouselCloneRenderDirective implements OnInit {
  // Принимаем только TemplateRef контента слайда.
  // Мы будем связывать этот инпут с slide.templateRef из сервиса.
  @Input('ngxCarouselCloneRenderContent') contentRef!: TemplateRef<unknown>;

  // ViewContainerRef - это контейнер элемента <li>, на который навешен этот атрибут.
  private viewContainer = inject(ViewContainerRef);

  ngOnInit() {
    // Очищаем контейнер на всякий случай, хотя тут это не должно быть необходимо
    //this.viewContainer.clear(); 

    if (this.contentRef) {
      // Ключевой момент: 
      // Вручную создаем новое представление (View) внутри текущего 
      // ViewContainerRef (элемента <li>), используя TemplateRef контента.
      // Это позволяет Angular создать независимый контекст для каждого клона, 
      // даже если они ссылаются на один и тот же templateRef.
      this.viewContainer.createEmbeddedView(this.contentRef); 
    }
  }
}