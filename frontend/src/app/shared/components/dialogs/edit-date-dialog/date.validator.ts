import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator that checks if a masked date string (MM / DD / YY) is valid and not in the past.
 *
 * @returns A ValidatorFn that returns an error object if the date is invalid or in the past, or null if valid.
 */
export function maskedDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') return { invalidDate: true };

    const [mm, dd, yy] = value.split(' / ');
    if (!mm || !dd || !yy) return { invalidDate: true };

    const month = Number(mm);
    const day = Number(dd);
    const year = Number('20' + yy); // '24' → 2024

    if (month < 1 || month > 12 || day < 1 || day > 31) return { invalidDate: true };

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return { invalidDate: true };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (date < today) {
      return { pastDate: true };
    }

    return null;
  };
}