import { Routes } from '@angular/router';
// import { RoleGuard } from '../shared/core/guard/role.guard';

export default [
  {
    path: 'dashboard',
    // canMatch: [RoleGuard],
    // data: { permission: 'canAnyAuthenticated' },
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
] as Routes;
