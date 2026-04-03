import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../shared/core/core.module';
import { ProgressBarModule } from 'primeng/progressbar';
import { SubscriptionDestroyer } from '../../shared/core/helper/SubscriptionDestroyer.helper';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-redirect',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressBarModule,
    CoreModule,
  ],
  template: `<p-progressBar
    *ngIf="loading"
    [mode]="'indeterminate'"
    [style]="{ height: '6px' }"
    styleClass="fixed top-0 left-0 w-full h-1 progress-bar"
  />`,
})
export class Redirect extends SubscriptionDestroyer implements OnInit {
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private messageService: MessageService,
  ) {
    super();
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) return this.fail('Missing token');

    history.replaceState({}, '', `${location.origin}/redirect`);

    this.auth
      .verifyToken(token)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (resp) => {
          sessionStorage.setItem('bearerToken', resp?.data ?? token);
          this.auth.getUserProfile().subscribe({
            next: (p) => {
              if (!p?.data) return this.fail('User profile not found');
              this.auth.setUser(p.data);
              this.router.navigate(['/admin/dashboard'], { replaceUrl: true });
            },
            error: (e) =>
              this.fail(e?.error?.message || 'Failed to load user profile'),
          });
        },
        error: () => this.fail('Invalid token'),
      });
  }

  private fail(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Login Failed',
      detail,
    });
    location.replace(environment.portal_client);
  }
}
