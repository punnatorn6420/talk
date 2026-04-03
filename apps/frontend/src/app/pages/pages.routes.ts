import { Routes } from '@angular/router';
// import { RoleGuard } from '../shared/core/guard/role.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    // canMatch: [RoleGuard],
    // data: { permission: 'canAnyAuthenticated' },
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
];
