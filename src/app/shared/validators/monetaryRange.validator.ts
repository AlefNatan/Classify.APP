import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function monetaryRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = parseFloat(control.value);
    if (isNaN(value)) return null;

    if (value < min) {
      return {
        monetaryRange: { message: `O valor mínimo é R$ ${min.toFixed(2)}` },
      };
    } else if (value > max) {
      return {
        monetaryRange: { message: `O valor máximo é R$ ${max.toFixed(2)}` },
      };
    }

    return null;
  };
}
