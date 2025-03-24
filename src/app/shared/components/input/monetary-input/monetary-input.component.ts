import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-monetary-input',
  templateUrl: './monetary-input.component.html',
  styleUrls: ['./monetary-input.component.scss'],
})
export class MonetaryInputComponent extends BaseComponent {
  public monetaryValue: string = '';

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
    // Adicione outras mensagens de erro personalizadas aqui, se necessário.
  };

  emitValue(event: any) {
    // Remover todos os caracteres que não sejam números
    const numericValue = event.detail.value.replace(/[^\d]/g, '');

    // Converter o valor para número, dividindo por 100 para obter a parte decimal
    const numericAmount = parseFloat(numericValue) / 100;

    // Verificar se o valor numérico é válido (não é NaN)
    if (isNaN(numericAmount)) {
      // Se o valor for inválido, sair do método sem emitir o evento
      return;
    }

    // Formatar o valor com duas casas decimais, sem o símbolo "R$"
    this.monetaryValue = numericAmount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Emitir o valor formatado por meio do evento valueChange
    this.valueChange.emit(this.monetaryValue);
  }
}
