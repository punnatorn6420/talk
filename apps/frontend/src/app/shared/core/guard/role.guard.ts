import { Injectable, inject } from '@angular/core';
import {
  CanMatch,
  Route,
  UrlTree,
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { PermissionService } from '../../../service/permission.service';
import { MessageService } from 'primeng/api';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanMatch, CanActivate {
  private permissionService = inject(PermissionService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  canMatch(route: Route): Observable<boolean | UrlTree> {
    const fnName = route.data?.['permission'] as string | undefined;
    return this.waitAndEvaluate(fnName);
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const fnName = route.data?.['permission'] as string | undefined;
    return this.waitAndEvaluate(fnName);
  }

  private waitAndEvaluate(fnName?: string): Observable<boolean | UrlTree> {
    return this.permissionService.userReady$().pipe(
      map(() => this.evaluateSync(fnName)),
      catchError(() => of(this.router.parseUrl('/admin/dashboard'))),
    );
  }

  private evaluateSync(fnName?: string): boolean | UrlTree {
    if (
      !fnName ||
      typeof this.permissionService[fnName as keyof PermissionService] !==
        'function'
    ) {
      setTimeout(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Permission Error',
          detail: 'No valid permission function found for route.',
          life: 4000,
        });
      });
      return this.router.parseUrl('/admin/dashboard');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allowed: boolean = (this.permissionService as any)[fnName]();
    if (allowed) return true;

    setTimeout(() => {
      this.messageService.add({
        severity: 'warn',
        summary: 'Unauthorized',
        detail: 'You do not have permission to access this page.',
        life: 4000,
      });
    });
    return this.router.parseUrl('/admin/dashboard');
  }
}
