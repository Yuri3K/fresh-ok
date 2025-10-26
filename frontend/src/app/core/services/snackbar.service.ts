import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly _snackBar = inject(MatSnackBar);

  openSnackBar(message: string, action: string = "OK", duration?: number) {
    duration
      ? this._snackBar.open(message, action, { duration })
      : this._snackBar.open(message, action)
  }
}
