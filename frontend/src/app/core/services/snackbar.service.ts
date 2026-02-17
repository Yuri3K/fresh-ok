import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly _snackBar = inject(MatSnackBar);

  openSnackBar(
    message: string,
    action: string = "OK",
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'bottom',
    duration?: number
  ) {
    duration
      ? this._snackBar.open(message, action, {
        horizontalPosition,
        verticalPosition,
        duration
      })
      : this._snackBar.open(message, action, {
        horizontalPosition,
        verticalPosition,
      })
  }
}
