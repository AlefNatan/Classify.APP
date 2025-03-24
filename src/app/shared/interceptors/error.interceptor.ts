import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ToastService } from '../services/toast.service';
import { StorageService } from '../services/storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,

    private storageService: StorageService,
    private toastService: ToastService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          return this.handleUnauthorizedError(error);
        }
        return throwError(error.error);
      }),
    );
  }

  private handleUnauthorizedError(error: HttpErrorResponse): Observable<never> {
    this.toastService.basicToast(
      'Poxa, parece que seu acesso expirou, por favor conecte-se novamente.',
      'negative',
    );

    this.storageService.clear();

    this.router.navigate(['auth', 'login']);

    return throwError(error.message);
  }
}
