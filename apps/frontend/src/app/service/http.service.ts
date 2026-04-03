import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionStorage } from '../shared/core/helper/session.helper';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private http = inject(HttpClient);
  private session = inject(SessionStorage);

  private getHeaders(includeAuth = true): HttpHeaders {
    let headers = this.baseHeaders;
    if (includeAuth) {
      const token =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('bearerToken')
          : null;
      if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<T>(url: string, includeAuth = true): Observable<T> {
    return this.http.get<T>(url, { headers: this.getHeaders(includeAuth) });
  }

  post<T, B>(url: string, data: T, includeAuth = true): Observable<B> {
    return this.http.post<B>(url, JSON.stringify(data), {
      headers: this.getHeaders(includeAuth),
    });
  }

  patch<T, B>(url: string, data: T, includeAuth = true): Observable<B> {
    return this.http.patch<B>(url, JSON.stringify(data), {
      headers: this.getHeaders(includeAuth),
    });
  }

  put<T, B>(url: string, data: T, includeAuth = true): Observable<B> {
    return this.http.put<B>(url, JSON.stringify(data), {
      headers: this.getHeaders(includeAuth),
    });
  }

  delete<T>(url: string, includeAuth = true): Observable<T> {
    return this.http.delete<T>(url, { headers: this.getHeaders(includeAuth) });
  }
}
