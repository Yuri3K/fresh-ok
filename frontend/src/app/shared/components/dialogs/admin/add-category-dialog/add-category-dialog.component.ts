import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlNameComponent } from '@shared/ui-elems/forms/form-control-name/form-control-name.component';
import { FormControlFileComponent } from "@shared/ui-elems/forms/form-control-file/form-control-file.component";
import { BtnIconComponent } from "@shared/ui-elems/buttons/btn-icon/btn-icon.component";
import { H3TitleComponent } from "@shared/ui-elems/typography/h3-title/h3-title.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, of, switchMap, tap } from 'rxjs';
import { FormControlCheckboxComponent } from "@shared/ui-elems/forms/form-control-checkbox/form-control-checkbox.component";
import { FormControlInputComponent } from "@shared/ui-elems/forms/form-control-input/form-control-input.component";
import { FormControlInputNumberComponent } from "@shared/ui-elems/forms/form-control-input-number/form-control-input-number.component";
import { BtnFlatComponent } from "@shared/ui-elems/buttons/btn-flat/btn-flat.component";
import { CatalogItem, CatalogService } from '@core/services/catalog.service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MEDIA_URL } from '@core/urls';

@Component({
  selector: 'app-add-category-dialog',
  imports: [
    MatDialogModule,
    FormControlNameComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormControlFileComponent,
    BtnIconComponent,
    H3TitleComponent,
    FormControlCheckboxComponent,
    FormControlInputComponent,
    FormControlInputNumberComponent,
    BtnFlatComponent,
    MatProgressSpinner
  ],
  templateUrl: './add-category-dialog.component.html',
  styleUrl: './add-category-dialog.component.scss'
})
export class AddCategoryDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef)
  private readonly catalogService = inject(CatalogService)
  private _fb = inject(FormBuilder)
  private data = inject(MAT_DIALOG_DATA)

  protected category: CatalogItem | null = this.data.category ?? null
  protected maxOrder: number = this.catalogService.categoriesLehgth + 2
  protected maxLengthName = 100
  protected maxLengthSlug = 50

  protected formComplete = signal(false)
  protected uploading = signal(false)
  protected readonly isEditMode = computed(() => !!this.category)

  protected readonly categoryForm = this._fb.group({
    ruName: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(this.maxLengthName)
    ]],
    enName: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(this.maxLengthName)
    ]],
    ukName: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(this.maxLengthName)
    ]],
    imageFile: [null],
    order: [this.maxOrder, [
      Validators.required,
      Validators.min(1),
      Validators.max(this.maxOrder)
    ]],
    slug: ['', [
      Validators.required,
      Validators.maxLength(this.maxLengthSlug)
    ]],
    published: [false],
  })

  protected readonly categoryChanged = toSignal(
    this.categoryForm.valueChanges
      .pipe(tap(changes => {
        const isFormComplete =
          this.ruNameControl.value !== ''
          && this.enNameControl.value !== ''
          && this.ukNameControl.value !== ''
          && this.slugControl.value !== ''

        if (!isFormComplete && !!this.publishedControl.value) {
          this.publishedControl.setValue(false)
        }

        this.formComplete.set(isFormComplete)
      })),
    { initialValue: null }
  )

  protected readonly currentImageUrl = computed(() => {
    if (!this.category) return ''

    const { publicId, imgVersion } = this.category
    if (!publicId) return ''

    return `${MEDIA_URL}v${imgVersion}/${publicId}`
  })

  get ruNameControl(): FormControl<string> {
    return this.categoryForm.get('ruName') as FormControl<string>
  }

  get enNameControl(): FormControl<string> {
    return this.categoryForm.get('enName') as FormControl<string>
  }

  get ukNameControl(): FormControl<string> {
    return this.categoryForm.get('ukName') as FormControl<string>
  }

  get imageFileControl(): FormControl<File | null> {
    return this.categoryForm.get('imageFile') as FormControl<File | null>
  }

  get orderControl(): FormControl<number> {
    return this.categoryForm.get('order') as FormControl<number>
  }

  get slugControl(): FormControl<string> {
    return this.categoryForm.get('slug') as FormControl<string>
  }

  get publishedControl(): FormControl<boolean> {
    return this.categoryForm.get('published') as FormControl<boolean>
  }

  constructor() {
    this.fillInEditableForm()
  }

  private fillInEditableForm() {
    if (this.category) {
      // patchValue — это метод Angular Reactive Forms, 
      // который позволяет обновить значения в форме частично, 
      // то есть только для тех контролов, которые будут указаны.
      // setValue требует, чтобы передали значения для ВСЕХ 
      // контролов формы. Если хотя бы один пропущен — будет ошибка.
      // patchValue обновляет только те поля, которые указали. 
      // Остальные остаются без изменений. Если передать лишние 
      // ключи (которых нет в форме) — TypeScript выдаст ошибку,
      this.categoryForm.patchValue({
        ruName: this.category.name.ru,
        enName: this.category.name.en,
        ukName: this.category.name.uk,
        order: this.category.order,
        slug: this.category.slug,
        published: this.category.isPublished
      })

      // При редактировании slug нельзя менять
      this.slugControl.disable()
    }

  }

  protected onSubmit() {
    if (this.categoryForm.invalid) return

    const slug = this.slugControl.value
    const imageFile = this.imageFileControl.value
    this.uploading.set(true)

    // Определяем нужно ли загружать картинку.
    // При редактировании у нас поле FileControl будет null,
    // (если пользователь картинку не добавил про обновлении)
    // но картинку мы отображаем за счет того, что получаем
    // ее по publicId и передаем в <app-form-control-file>
    const uploadImage$ = imageFile
      ? this.catalogService.uploadCategoryImage(imageFile, slug)
      : of(this.category ? {
        publicId: this.category.publicId,
        imgVersion: this.category.imgVersion
      } : { publicId: '', imgVersion: 0 })

    uploadImage$
      .pipe(
        switchMap(uploadResult => {
          const categoryData = {
            slug,
            order: this.orderControl.value,
            name: {
              en: this.enNameControl.value,
              ru: this.ruNameControl.value,
              uk: this.ukNameControl.value
            },
            publicId: uploadResult.publicId,
            imgVersion: uploadResult.imgVersion,
            isPublished: this.publishedControl.value
          }

          // Создание или редактирование
          return this.isEditMode()
            ? this.catalogService.editCategory(categoryData)
            : this.catalogService.createCategory(categoryData)
        }),
        finalize(() => this.uploading.set(false))
      )
      .subscribe({
        next: () => {
          this.dialogRef.close()
          this.catalogService.getCatalogList().subscribe()
        },
        error: err => console.error('Error:', err)
      })
  }
}
