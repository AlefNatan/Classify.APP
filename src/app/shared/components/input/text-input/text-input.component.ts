import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent extends BaseComponent {
  constructor() {
    super();
  }

  @Input() label: string = 'Título';
  @Input() placeholder: string = 'Texto de placeholder';
  @Input() type: string = 'text';
  @Input() maxLength: number = 100;
  @Input() inputMode: string = 'text';
  @Input() message: string = 'Mensagem de erro';
  @Input() counter: boolean = false;
  @Input() required: boolean = true;
  @Input() controlName: any;

  @Output() valueChange = new EventEmitter<string>();

  errorMessages: Record<string, string> = {
    required: 'Este campo é obrigatório.',
  };

  public emitValue(event: any) {
    this.valueChange.emit(event.detail.value);
  }
}
