import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';

import { LoginPage } from './login/login.page';
import { SignupPage } from './signup/signup.page';

@NgModule({
  declarations: [LoginPage, SignupPage],
  imports: [CommonModule, FormsModule, AuthRoutingModule, SharedModule],
})
export class AuthModule {}
