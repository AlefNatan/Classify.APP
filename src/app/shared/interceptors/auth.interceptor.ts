import { Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return from(this.storageService.get('token').then((res: any) => res)).pipe(
      mergeMap((token) => {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token?.token}`),
        });

        return next.handle(authReq);
      }),
    );
  }
}
