import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { filter, take, map } from 'rxjs';
import { IUserRole } from '../types/auth.model';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private authService = inject(AuthService);

  private getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  userReady$() {
    return this.authService.currentUser$.pipe(
      filter((u) => !!u),
      take(1),
      map(() => true),
    );
  }

  canAnyAuthenticated(): boolean {
    const currentUser = this.getCurrentUser();
    return !!currentUser;
  }

  canOnlyAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    const allowedRoles: IUserRole[] = [IUserRole.Admin];
    return currentUser
      ? currentUser.roles.some((role) => allowedRoles.includes(role))
      : false;
  }
}
