import { NgModule } from '@angular/core';
import { SkeletonLoadingComponent } from './skeleton-loading.component';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [SkeletonLoadingComponent],
  exports: [SkeletonLoadingComponent],
  imports: [SkeletonModule],
})
export class SkeletonLoadingModule {}
