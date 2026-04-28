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
        path: 'create',
        loadComponent: () =>
          import(
            './messages/components/message-user-form/message-form-page.component'
          ).then((m) => m.MessageFormPageComponent),
      },
      {
        path: ':id/view',
        loadComponent: () =>
          import(
            './messages/components/message-user-form/message-form-page.component'
          ).then((m) => m.MessageFormPageComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import(
            './messages/components/message-user-form/message-form-page.component'
          ).then((m) => m.MessageFormPageComponent),
      },
      {
        path: 'broadcasts/create',
        loadComponent: () =>
          import(
            './messages/components/broadcast-admin-form/broadcast-admin-form.create.component'
          ).then((m) => m.BroadcastAdminFormCreateComponent),
      },
      {
        path: 'broadcasts/:id/edit',
        loadComponent: () =>
          import(
            './messages/components/broadcast-admin-form/broadcast-admin-form.edit.component'
          ).then((m) => m.BroadcastAdminFormEditComponent),
      },
      {
        path: 'broadcasts/:id/view',
        loadComponent: () =>
          import('./messages/components/broadcast-detail-page.component').then(
            (m) => m.BroadcastDetailPageComponent,
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
