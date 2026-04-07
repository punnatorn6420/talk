import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUserInfo, IUserRole } from '../types/auth.model';
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

  loadProfile() {
    this.currentUserSubject.next({
      id: 14,
      objectId: '93834fe2-c75b-4276-a7d7-6a1d9ba2e29c',
      firstName: 'Punnatorn',
      lastName: 'Yimpong',
      email: 'Punnatorn.Yim@nokair.co.th',
      jobTitle: 'Front-End Development',
      department: 'HQ',
      active: true,
      roles: [IUserRole.Admin],
      team: '',
      createdAt: '2025-08-08T14:30:29',
      modifiedAt: '2025-08-08T14:30:29',
    });
  }
}
