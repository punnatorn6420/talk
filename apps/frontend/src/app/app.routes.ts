import { Route } from '@angular/router';
import { Notfound } from './pages/notfound/notfound';
import { AppLayout } from './shared/layout/components/app.layout';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  {
    path: 'admin',
    component: AppLayout,
    children: [
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () => import('../app/pages/pages.routes'),
      },
    ],
  },
  { path: 'notfound', component: Notfound },
  {
    path: '',
    loadChildren: () => import('../app/pages/auth/auth.routes'),
  },
  { path: '**', redirectTo: '/notfound' },
];
