import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FormComponent } from './form/form.component';

import { TextInputComponent } from './components/input/text-input/text-input.component';
import { TextAreaInputComponent } from './components/input/textarea-input/textarea-input.component';
import { PasswordInputComponent } from './components/input/password-input/password-input.component';
import { MonetaryInputComponent } from './components/input/monetary-input/monetary-input.component';
import { PhoneInputComponent } from './components/input/phone-input/phone-input.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AuthInterceptor } from 'src/app/shared/interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  imports: [FormsModule, CommonModule, IonicModule, ReactiveFormsModule],
  exports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormComponent,

    TextInputComponent,
    TextAreaInputComponent,
    PasswordInputComponent,
    MonetaryInputComponent,
    PhoneInputComponent,
  ],
  declarations: [
    FormComponent,
    TextInputComponent,
    TextAreaInputComponent,
    PasswordInputComponent,
    MonetaryInputComponent,
    PhoneInputComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {}
