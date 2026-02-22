import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function maxDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') return { invalidDate: true };

    const [mm, dd, yy] = value.split(' / ');
    if (!mm || !dd || !yy) return { invalidDate: true };

    const year = Number('20' + yy);
    const month = Number(mm);
    const day = Number(dd);

    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) return { invalidDate: true };

    // Проверка на совпадение (исключает "31 февраля")
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return { invalidDate: true };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date > today) {
      return { futureDate: true };
    }

    return null;
  };
}
