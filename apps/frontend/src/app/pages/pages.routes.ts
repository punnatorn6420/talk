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
      {
        path: 'compose',
        loadComponent: () =>
          import('./messages/components/ui/mail-compose').then(
            (c) => c.MailComposeComponent,
          ),
      },
      {
        path: 'archived',
        loadComponent: () =>
          import('./messages/components/ui/mail-archive').then(
            (c) => c.MailArchiveComponent,
          ),
      },
      {
        path: 'important',
        loadComponent: () =>
          import('./messages/components/ui/mail-important').then(
            (c) => c.MailImportantComponent,
          ),
      },
      {
        path: 'sent',
        loadComponent: () =>
          import('./messages/components/ui/mail-sent').then(
            (c) => c.MailSentComponent,
          ),
      },
      {
        path: 'spam',
        loadComponent: () =>
          import('./messages/components/ui/mail-spam').then(
            (c) => c.MailSpamComponent,
          ),
      },
      {
        path: 'starred',
        loadComponent: () =>
          import('./messages/components/ui/mail-starred').then(
            (c) => c.MailStarredComponent,
          ),
      },
      {
        path: 'trash',
        loadComponent: () =>
          import('./messages/components/ui/mail-trash').then(
            (c) => c.MailTrashComponent,
          ),
      },
    ],
  },
] as Routes;
