import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUserInfo } from '../types/auth.model';
import { environment } from '../../environments/environment';
import { IResponse } from '../types/response.model';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<IUserInfo | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private http = inject(HttpClient);
  private https = inject(HttpService);

  setUser(user: IUserInfo): void {
    this.currentUserSubject.next(user);
  }

  getUser(): IUserInfo | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): IUserInfo | null {
    return this.getUser();
  }

  logout() {
    sessionStorage.clear();
    this.currentUserSubject.next(null);
  }

  verifyToken(token: string): Observable<IResponse<string>> {
    return this.http.get<IResponse<string>>(
      `${environment.endpoint}v1/auth/validate-token`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  refreshToken(token: string) {
    return this.http.post(`${environment.endpoint}v1/refresh-token`, '', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getUserProfile(): Observable<IResponse<IUserInfo>> {
    return this.https.get(`${environment.endpoint}v1/get-profile-user`, true);
  }

  loadProfile(): Promise<void> {
    const token = sessionStorage.getItem('bearerToken');
    if (!token) {
      if (!location.href.startsWith(environment.portal_client)) {
        location.replace(environment.portal_client);
      }
      return Promise.resolve();
    }
    return firstValueFrom(this.getUserProfile()).then(
      (res) => {
        this.currentUserSubject.next(res.data ?? null);
      },
      () => {
        this.currentUserSubject.next(null);
        if (!location.href.startsWith(environment.portal_client)) {
          location.replace(environment.portal_client);
        }
      },
    );
  }
}
