import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
    return of({
      correlationId: 'mock-correlation-id',
      status: 'SUCCESS',
      data: this.buildMockProfile(),
    });
  }

  loadProfile(): Promise<void> {
    this.currentUserSubject.next(this.buildMockProfile());
    return Promise.resolve();
  }

  private buildMockProfile(): IUserInfo {
    const urlRole = new URLSearchParams(location.search).get('role');
    if (urlRole) {
      sessionStorage.setItem('mockRole', urlRole);
    }

    const activeRole = (
      sessionStorage.getItem('mockRole') || 'Admin'
    ).toLowerCase();
    const role = activeRole === 'admin' ? IUserRole.Admin : IUserRole.User;

    return {
      id: 1,
      objectId: '93834fe2-c75b-4276-a7d7-6a1d9ba2e29c',
      firstName: 'Punnatorn',
      lastName: 'Yimpong',
      email: 'Punnatorn.Yim@nokair.co.th',
      jobTitle: 'Front-End Development',
      department: 'HQ',
      active: true,
      roles: [role],
      team: '',
      createdAt: '2025-06-10T15:40:50',
      modifiedAt: '2025-06-10T15:40:50',
    };
  }
}
