import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../shared/prime-ng.module';
import { ConfirmationService } from 'primeng/api';
import { SkeletonLoadingModule } from '../../shared/skeleton-loading/skeleton-loading.module';
import { CoreModule } from '../../shared/core/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SkeletonLoadingModule,
    CoreModule,
    RouterModule.forChild(dashboardRoutes),
  ],
  providers: [ConfirmationService],
})
export class DashboardModule {}
