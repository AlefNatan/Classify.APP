import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import HttpService from 'src/app/shared/http/http.service';

import type { AuthRequest } from 'src/app/types/request/auth.request';
import type { AuthResponse } from 'src/app/types/response/auth.response';
import type { CreateUserRequest } from 'src/app/types/request/user.request';
import type { UserResponse } from 'src/app/types/response/user.response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpService: HttpService) {}

  public signIn(payload: AuthRequest): Observable<string> {
    return this.httpService.post<string>('Authenticate/Login', payload);
  }

  public getUserData(): Observable<UserResponse> {
    return this.httpService.get<UserResponse>('Authenticate/Me');
  }

  public signUp(payload: CreateUserRequest): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>('User', payload);
  }
}
