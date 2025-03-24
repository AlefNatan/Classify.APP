import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
})
export class PhoneInputComponent extends BaseComponent {
  public phoneValue: string = '';

  constructor() {
    super();
  }

  @Input() label: string = 'Telefone';
  @Input() placeholder: string = 'Digite o telefone';
  @Input() message: string = 'Mensagem de erro';
  @Input() controlName: any;

  @Output() valueChange = new EventEmitter<string>();

  errorMessages: Record<string, string> = {
    required: 'Este campo é obrigatório.',
    pattern: 'Digite um telefone válido.',
  };

  emitValue(event: any) {
    // Remove todos os caracteres que não sejam números
    const numericValue = event.detail.value.replace(/[^\d]/g, '');

    // Verifica se tem pelo menos 10 dígitos (DDD + número)
    if (numericValue.length < 10) {
      return;
    }

    // Formata o número baseado no tamanho
    let formattedNumber = '';

    // Se tiver 11 dígitos (com 9), assume que é celular
    if (numericValue.length === 11) {
      formattedNumber = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
    }
    // Se tiver 10 dígitos (sem 9), assume que é fixo
    else if (numericValue.length === 10) {
      formattedNumber = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
    }

    this.phoneValue = formattedNumber;
    this.valueChange.emit(formattedNumber);
  }
}
