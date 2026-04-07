import { Routes } from '@angular/router';

export default [
  {
    path: 'messages',
    loadComponent: () =>
      import('./messages/messages.component').then((m) => m.MessagesComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./messages/components/messages-entry.component').then(
            (m) => m.MessagesEntryComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./messages/components/message-admin-detail.component').then(
            (m) => m.MessageAdminDetailComponent,
          ),
      },
    ],
  },
] as Routes;
