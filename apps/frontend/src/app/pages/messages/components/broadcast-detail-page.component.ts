import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { _BroadcastService } from '../../../service/broadcast.service';
import {
  IBroadcastDetail,
  IBroadcastAttachment,
} from '../../../types/broadcast.model';
import { SubscriptionDestroyer } from '../../../shared/core/helper/SubscriptionDestroyer.helper';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-broadcast-detail-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule],
  templateUrl: './broadcast-detail-page.component.html',
  styleUrl: './broadcast-detail-page.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BroadcastDetailPageComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly broadcastApi = inject(_BroadcastService);
  private readonly toast = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly auth = inject(AuthService);

  loading = false;
  broadcastId: string | null = null;
  broadcast: IBroadcastDetail | null = null;

  watermarkImage = '';
  watermarkText = '';

  ngOnInit(): void {
    this.broadcastId = this.route.snapshot.paramMap.get('id');

    if (!this.broadcastId) {
      this.goBack();
      return;
    }

    this.loadBroadcastDetail(this.broadcastId);

    this.setWatermarkText();
  }

  private setWatermarkText(): void {
    const user = this.auth.getUser();

    const fullName = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    const displayName = fullName || user?.email || 'Unknown User';
    this.watermarkText = displayName;
    this.watermarkImage = this.buildWatermarkImage(`Viewed by ${displayName}`);
  }

  private buildWatermarkImage(text: string): string {
    const encodedText = encodeURIComponent(text);
    return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='240' viewBox='0 0 420 240'%3E%3Ctext x='30' y='90' font-family='Arial, sans-serif' font-size='22' font-weight='700' fill='%2364748b'%3E${encodedText}%3C/text%3E%3C/svg%3E")`;
  }

  loadBroadcastDetail(id: string): void {
    this.loading = true;

    const obs = this.broadcastApi
      .getBroadcastById(id)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res: unknown) => {
          this.broadcast = (res as { data: IBroadcastDetail }).data ?? null;
          if (!this.broadcast) {
            this.toast.add({
              severity: 'warn',
              summary: 'Not found',
              detail: 'Broadcast detail is unavailable.',
            });
            this.goBack();
            return;
          }

          const markReadObs = this.broadcastApi
            .markBroadcastAsRead(id)
            .subscribe({
              error: () => {
                // ignore read error silently
              },
            });
          this.AddSubscription(markReadObs);

          this.cdr.markForCheck();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load broadcast detail.',
          });
          this.goBack();
        },
      });
    this.AddSubscription(obs);
  }

  goBack(): void {
    this.router.navigate(['/admin/messages'], {
      queryParams: { menu: this.returnMenu },
    });
  }

  private get returnMenu(): string {
    return this.route.snapshot.queryParamMap.get('menu') || 'broadcasts';
  }

  getReadStatusLabel(): string {
    return this.broadcast?.isRead ? 'Read' : 'Unread';
  }

  getReadStatusSeverity(): 'success' | 'info' | 'warn' | 'secondary' {
    return this.broadcast?.isRead ? 'success' : 'warn';
  }

  getBroadcastStatusSeverity(
    status?: string | null,
  ): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'draft':
        return 'secondary';
      case 'sent':
        return 'success';
      case 'read':
        return 'info';
      default:
        return 'secondary';
    }
  }

  downloadAttachment(attachment: IBroadcastAttachment): void {
    if (!this.broadcastId || !attachment?.id) return;

    const obs = this.broadcastApi
      .downloadBroadcastAttachment(this.broadcastId, attachment.id)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = attachment.fileName || 'attachment';
          anchor.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Download failed',
            detail: 'Unable to download attachment.',
          });
          this.cdr.markForCheck();
        },
      });
    this.AddSubscription(obs);
  }
}
