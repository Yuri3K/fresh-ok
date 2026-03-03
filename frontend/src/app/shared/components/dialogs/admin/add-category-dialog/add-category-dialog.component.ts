import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlNameComponent } from '@shared/ui-elems/forms/form-control-name/form-control-name.component';

@Component({
  selector: 'app-add-category-dialog',
  imports: [
    MatDialogModule,
    FormControlNameComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
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

  protected readonly categoryForm = this._fb.group({
    ruName: ['', [Validators.required, Validators.maxLength(100)]],
    enName: ['', [Validators.required, Validators.maxLength(100)]],
    ukName: ['', [Validators.required, Validators.maxLength(100)]],
    imageFile: [null, Validators.required],
    order: [this.maxOrder + 1, [
      Validators.required,
      Validators.min(1), Validators.max(this.maxOrder + 1)
    ]],
    slug: ['', [Validators.required, Validators.maxLength(50)]]
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

  protected onSubmit() {

  }
}
