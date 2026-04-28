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

@Component({
  selector: 'app-broadcast-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './broadcast-detail-page.component.html',
  styleUrl: './broadcast-detail-page.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BroadcastDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly broadcastApi = inject(_BroadcastService);
  private readonly toast = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  broadcastId: string | null = null;
  broadcast: IBroadcastDetail | null = null;

  ngOnInit(): void {
    this.broadcastId = this.route.snapshot.paramMap.get('id');

    if (!this.broadcastId) {
      this.goBack();
      return;
    }

    this.loadBroadcastDetail(this.broadcastId);
  }

  loadBroadcastDetail(id: string): void {
    this.loading = true;

    this.broadcastApi
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

          this.broadcastApi.markBroadcastAsRead(id).subscribe({
            error: () => {
              // ignore read error silently
            },
          });

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
  }

  goBack(): void {
    this.router.navigate(['/admin/messages']);
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

    this.broadcastApi
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
  }
}
