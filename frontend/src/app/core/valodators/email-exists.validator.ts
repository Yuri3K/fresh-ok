import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { catchError, map, of, switchMap, timer } from "rxjs";
import { ApiService } from "../services/api.service";

export function emailExistsValidator(apiService: ApiService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if(!control.value) {
        return of(null)
      }

      return timer(400)
        .pipe(
          switchMap(() => {
            return apiService.postWithoutToken('/register/check-email', {email: control.value})
            .pipe(
              map((res: any) => {
                return res.exists ? {emailExists: true} : null
              }),
              catchError(() => of(null))
            )
          })
        )
    }
}