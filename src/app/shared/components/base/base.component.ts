import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
  public getErrorText(
    control: AbstractControl,
    errorMessages: Record<string, string>,
  ) {
    if (!control || !control.errors) return null;

    for (const errorKey in control.errors) {
      if (control.errors.hasOwnProperty(errorKey)) {
        // Checa o erro do validador personalizado 'monetaryRange'
        if (errorKey === 'monetaryRange') {
          return control.errors[errorKey].message;
        }
        // Retorna outras mensagens de erro conforme o mapeamento de `errorMessages`
        return errorMessages[errorKey];
      }
    }

    return null;
  }
}
