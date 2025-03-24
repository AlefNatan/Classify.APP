import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
})
export class PasswordInputComponent extends BaseComponent {
  constructor() {
    super();
  }

  @Input() label: string = 'Título';
  @Input() placeholder: string = 'Texto de placeholder';
  @Input() message: string = 'Mensagem de erro';
  @Input() controlName: any;

  @Output() valueChange = new EventEmitter<string>();

  errorMessages: Record<string, string> = {
    required: 'Este campo é obrigatório.',
    minlength: 'A senha deve ter pelo menos 8 caracteres.',
    maxlength: 'A senha deve no máximo 16 caracteres.',
    mismatch: 'As senhas devem coincidir',
    // Adicione outras mensagens de erro personalizadas aqui, se necessário.
  };

  public emitValue(event: any) {
    this.valueChange.emit(event.detail.value);
  }
}
