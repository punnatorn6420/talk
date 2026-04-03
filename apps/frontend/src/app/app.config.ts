import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './service/auth.service';

function loadProfileInitializer(): Promise<void> {
  const auth = inject(AuthService);
  if (location.pathname.includes('/redirect')) {
    const t = new URLSearchParams(location.search).get('token');
    if (t) sessionStorage.setItem('bearerToken', t);
    return Promise.resolve();
  }
  return auth.loadProfile();
}

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    ConfirmationService,
    // provideAppInitializer(loadProfileInitializer),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      ripple: true,
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
