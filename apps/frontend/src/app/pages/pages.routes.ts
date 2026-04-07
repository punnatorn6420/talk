import { Routes } from '@angular/router';

export default [
  {
    path: 'messages',
    loadComponent: () =>
      import('./messages/messages.component').then((m) => m.MessagesComponent),
  },
] as Routes;
