import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {
  public formGroup!: FormGroup;

  public updateFormControlValue(
    formGroup: FormGroup,
    formControlName: string,
    value: string,
  ) {
    formGroup.get(`${formControlName}`)?.setValue(value);
  }
}
