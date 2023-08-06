import { AbstractControl, ValidationErrors } from '@angular/forms';

export class AddFormValidators {
  static shouldHoldValue(control: AbstractControl): ValidationErrors | null {
    if (control.value === '') {
      return { noValueContained: true };
    }
    return null;
  }

  static shouldNotContainSpaces(
    control: AbstractControl
  ): ValidationErrors | null {
    if (control.value?.indexOf(' ') > -1) {
      return { shouldNotContainSpaces: true };
    }
    return null;
  }
}
