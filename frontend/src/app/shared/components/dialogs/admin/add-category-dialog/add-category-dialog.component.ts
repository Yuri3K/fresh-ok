import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlNameComponent } from '@shared/ui-elems/forms/form-control-name/form-control-name.component';
import { FormControlFileComponent } from "@shared/ui-elems/forms/form-control-file/form-control-file.component";
import { BtnIconComponent } from "@shared/ui-elems/buttons/btn-icon/btn-icon.component";
import { H3TitleComponent } from "@shared/ui-elems/typography/h3-title/h3-title.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { FormControlCheckboxComponent } from "@shared/ui-elems/forms/form-control-checkbox/form-control-checkbox.component";

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
    FormControlCheckboxComponent
],
  templateUrl: './add-category-dialog.component.html',
  styleUrl: './add-category-dialog.component.scss'
})
export class AddCategoryDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef)
  private _fb = inject(FormBuilder)
  private data = inject(MAT_DIALOG_DATA)

  private categories = this.data.categories
  protected maxOrder: number = this.categories.length

  protected formComplete = signal(false)

  protected readonly categoryForm = this._fb.group({
    ruName: ['', [Validators.maxLength(100)]],
    enName: ['', [Validators.maxLength(100)]],
    ukName: ['', [Validators.maxLength(100)]],
    imageFile: [null],
    order: [this.maxOrder + 1, [
      Validators.min(1), Validators.max(this.maxOrder + 1)
    ]],
    slug: ['asdf', [Validators.required, Validators.maxLength(50)]],
    published: [false],
  })

  protected categoryChanged = toSignal(
    this.categoryForm.valueChanges
      .pipe(tap(changes => {
        const isFormComplete =  
          this.ruNameControl.value !== '' 
          && this.enNameControl.value !== '' 
          && this.ukNameControl.value !== '' 
          && this.slugControl.value !== '' 

          if(!isFormComplete && !!this.publishedControl.value) {
            this.publishedControl.setValue(false)
          }

          this.formComplete.set(isFormComplete)
      })),
    { initialValue: null }
  )

  

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

  protected onSubmit() {

  }
}
