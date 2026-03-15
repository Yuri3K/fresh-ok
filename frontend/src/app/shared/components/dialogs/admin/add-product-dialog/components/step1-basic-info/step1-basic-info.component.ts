import { Component, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CatalogService } from '@core/services/catalog.service';
import { TranslateModule } from '@ngx-translate/core';
import { BtnFlatComponent } from '@shared/ui-elems/buttons/btn-flat/btn-flat.component';
import { FormControlInputComponent } from '@shared/ui-elems/forms/form-control-input/form-control-input.component';
import { FormControlNameComponent } from '@shared/ui-elems/forms/form-control-name/form-control-name.component';

@Component({
  selector: 'app-step1-basic-info',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    FormControlInputComponent,
    FormControlNameComponent,
    MatSelectModule,
    BtnFlatComponent
  ],
  templateUrl: './step1-basic-info.component.html',
  styleUrl: './step1-basic-info.component.scss'
})
export class Step1BasicInfoComponent {
  private readonly fb = inject(FormBuilder)
  private readonly catalogService = inject(CatalogService)

  // Output для передачи данных в родительский компонент
  stepCompleted = output<{
    category: string
    slug: string
    nameEn: string
    nameRu: string
    nameUk: string
    price: number
    currency: string
    code: string
  }>()

  protected readonly categories = toSignal(
    this.catalogService.catalogList$,
    { requireSync: true }
  )

  protected readonly basicForm = this.fb.group({
    category: ['', Validators.required],
    slug: ['', [Validators.required, Validators.maxLength(50)]],
    nameEn: ['', [Validators.required, Validators.maxLength(100)]],
    nameRu: ['', [Validators.required, Validators.maxLength(100)]],
    nameUk: ['', [Validators.required, Validators.maxLength(100)]],
    price: [0, [Validators.required, Validators.min(0)]],
    currency: ['UAH', Validators.required],
    code: ['']
  })

  protected onNext() {
    if (this.basicForm.valid) {
      this.stepCompleted.emit(this.basicForm.value as any)
    }
  }
}
