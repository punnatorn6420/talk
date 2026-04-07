import { Routes } from '@angular/router';

export default [
  {
    path: 'messages',
    loadComponent: () =>
      import('./messages/messages.component').then((m) => m.MessagesComponent),
    children: [
      { path: '', redirectTo: 'inbox', pathMatch: 'full' },
      {
        path: 'inbox',
        loadComponent: () =>
          import('./messages/components/ui/mail-inbox').then(
            (c) => c.MailInboxComponent,
          ),
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./messages/components/ui/mail-detail').then(
            (c) => c.MailDetailComponent,
          ),
      },
    ],
  },
] as Routes;
