import { Routes } from '@angular/router';
import { Redirect } from './redirect';

export default [
  { path: '', redirectTo: 'notfound', pathMatch: 'full' },
  { path: 'redirect', component: Redirect },
] as Routes;
