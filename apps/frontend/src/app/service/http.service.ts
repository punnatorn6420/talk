import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly baseHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private readonly http = inject(HttpClient);

  private getHeaders(includeAuth = true): HttpHeaders {
    let headers = this.baseHeaders;

    if (includeAuth && typeof window !== 'undefined') {
      const token = sessionStorage.getItem('bearerToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  get<T>(url: string, includeAuth = true): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.getHeaders(includeAuth),
    });
  }

  post<TRequest, TResponse>(
    url: string,
    data: TRequest,
    includeAuth = true,
  ): Observable<TResponse> {
    return this.http.post<TResponse>(url, data, {
      headers: this.getHeaders(includeAuth),
    });
  }

  patch<TRequest, TResponse>(
    url: string,
    data: TRequest,
    includeAuth = true,
  ): Observable<TResponse> {
    return this.http.patch<TResponse>(url, data, {
      headers: this.getHeaders(includeAuth),
    });
  }

  put<TRequest, TResponse>(
    url: string,
    data: TRequest,
    includeAuth = true,
  ): Observable<TResponse> {
    return this.http.put<TResponse>(url, data, {
      headers: this.getHeaders(includeAuth),
    });
  }

  delete<TResponse>(url: string, includeAuth = true): Observable<TResponse> {
    return this.http.delete<TResponse>(url, {
      headers: this.getHeaders(includeAuth),
    });
  }
}
