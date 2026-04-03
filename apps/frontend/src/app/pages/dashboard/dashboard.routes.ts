import { Routes } from '@angular/router';
// import { RoleGuard } from '../../shared/core/guard/role.guard';
import { DashboardComponent } from './dashboard.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    // canMatch: [RoleGuard],
    // data: { permission: 'canOnlyAdmin' },
    component: DashboardComponent,
  },
];
