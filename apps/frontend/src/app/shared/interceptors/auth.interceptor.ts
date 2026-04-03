import { Injectable, NgZone, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private static redirecting = false;
  private zone = inject(NgZone);

  intercept<T>(
    req: HttpRequest<T>,
    next: HttpHandler,
  ): Observable<HttpEvent<T>> {
    const token = sessionStorage.getItem('bearerToken');
    const cloned = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(cloned).pipe(
      catchError((err: HttpErrorResponse) => {
        if (
          (err.status === 401 || err.status === 403) &&
          !AuthInterceptor.redirecting
        ) {
          AuthInterceptor.redirecting = true;
          try {
            sessionStorage.clear();
          } catch {
            // ignore
          }
          this.zone.run(() => {
            const onRedirectPage = location.pathname.includes('/redirect');
            if (!onRedirectPage) {
              location.replace(environment.portal_client);
            } else {
              AuthInterceptor.redirecting = false;
            }
          });
        }
        return throwError(() => err);
      }),
    );
  }
}
