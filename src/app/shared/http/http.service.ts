import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BASE_URL_API } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export default class HttpService {
  private apiUrl: string;

  constructor(protected http: HttpClient) {
    this.apiUrl = BASE_URL_API;
  }

  public getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR',
      'x-api-version': '1.0',
    });
  }

  public get<T>(url: string, options?: any): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}${url}`, {
        ...options,
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => response as T),
        catchError(this.handleError),
      );
  }

  public post<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http
      .post(`${this.apiUrl}${url}`, body, {
        ...options,
        headers: this.getAuthHeaders(),
        responseType: 'text',
      })
      .pipe(
        map((response: any) => {
          if (typeof response === 'string') {
            try {
              return JSON.parse(response) as T;
            } catch {
              return response as T;
            }
          }
          return response as T;
        }),
        catchError(this.handleError),
      );
  }

  public put<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}${url}`, body, {
        ...options,
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => response as T),
        catchError(this.handleError),
      );
  }

  public delete<T>(url: string, body?: any, options?: any): Observable<T> {
    return this.http
      .delete(`${this.apiUrl}${url}`, {
        ...options,
        headers: this.getAuthHeaders(),
        body,
        responseType: 'text',
      })
      .pipe(
        map((response: any) => {
          if (typeof response === 'string') {
            try {
              return JSON.parse(response) as T;
            } catch {
              return response as T;
            }
          }
          return response as T;
        }),
        catchError(this.handleError),
      );
  }

  private handleError(error: any) {
    let errorResponse;

    const errorJson = JSON.parse(error);

    errorResponse = {
      success: false,
      message: errorJson.message || 'Erro desconhecido',
      typeMessage: 0,
    };

    if (error.error && typeof error.error === 'object') {
      errorResponse.message = errorResponse.message || 'Erro desconhecido';
      errorResponse.typeMessage = error.error.typeMessage || 0;
    } else if (error.error instanceof ErrorEvent) {
      errorResponse.message = errorResponse.message || 'Erro desconhecido';
    } else {
      errorResponse.message = errorResponse.message || 'Erro desconhecido';
    }

    return throwError(() => errorResponse);
  }
}
