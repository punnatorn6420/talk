import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, finalize, interval, takeUntil } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

import { _BroadcastService } from '../../../service/broadcast.service';
import { _MessageService } from '../../../service/message.service';
import { DateTimePipe } from '../../../shared/core/pipes/date-time.pipe';
import {
  IBroadcastItem,
  IBroadcastReader,
} from '../../../types/broadcast.model';
import { IMail, IMessageParams } from '../../../types/message.model';

type MailSidebarKey = 'inbox' | 'broadcasts';

@Component({
  selector: 'app-messages-admin-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    PaginatorModule,
    ConfirmDialogModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    CardModule,
    DateTimePipe,
    DialogModule,
    SkeletonModule,
    TagModule,
  ],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesAdminViewComponent implements OnInit, OnDestroy {
  private readonly messageApi = inject(_MessageService);
  private readonly broadcastApi = inject(_BroadcastService);
  private readonly toast = inject(MessageService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroy$ = new Subject<void>();

  mails: IMail[] = [];
  broadcasts: IBroadcastItem[] = [];

  loadingMessages = false;
  loadingBroadcasts = false;

  sendingBroadcastId: number | null = null;
  deletingBroadcastId: number | null = null;

  inboxTotalCount = 0;
  broadcastTotalCount = 0;

  keyword = '';
  selectedMenu: MailSidebarKey = 'inbox';
  lastRefreshedAt: Date | null = null;

  readonly menuItems: { key: MailSidebarKey; label: string; icon: string }[] = [
    { key: 'inbox', label: 'Inbox', icon: 'pi pi-inbox' },
    { key: 'broadcasts', label: 'Broadcasts', icon: 'pi pi-megaphone' },
  ];

  params: IMessageParams = {
    keyword: '',
    pageNumber: 1,
    pageSize: 10,
    sortField: 'postedAt',
    ascending: false,
  };

  broadcastReadersDialogVisible = false;
  broadcastReadersLoading = false;
  broadcastReaders: IBroadcastReader[] = [];
  selectedReadersBroadcast: IBroadcastItem | null = null;

  ngOnInit(): void {
    this.loadMessages();
    this.loadBroadcastCounts();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get totalCount(): number {
    return this.selectedMenu === 'broadcasts'
      ? this.broadcastTotalCount
      : this.inboxTotalCount;
  }

  private startAutoRefresh(): void {
    interval(5 * 60 * 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshCurrentMenu(true);
      });
  }

  refreshCurrentMenu(silent = false): void {
    if (this.selectedMenu === 'broadcasts') {
      this.loadBroadcasts(silent);
    } else {
      this.loadMessages(silent);
    }

    this.refreshSidebarCounts();
  }

  refreshSidebarCounts(): void {
    this.messageApi
      .getMessageCriteria({
        keyword: '',
        pageNumber: 1,
        pageSize: 1,
        sortField: 'postedAt',
        ascending: false,
      })
      .subscribe({
        next: (res) => {
          this.inboxTotalCount = res.data?.totalCount ?? 0;
          this.cdr.markForCheck();
        },
      });

    this.broadcastApi
      .getBroadcasts({
        keyword: '',
        pageNumber: 1,
        pageSize: 1,
      })
      .subscribe({
        next: (res) => {
          this.broadcastTotalCount = res.data?.totalCount ?? 0;
          this.cdr.markForCheck();
        },
      });
  }

  loadBroadcastCounts(): void {
    this.broadcastApi
      .getBroadcasts({
        keyword: '',
        pageNumber: 1,
        pageSize: 1,
      })
      .subscribe({
        next: (res) => {
          this.broadcastTotalCount = res.data?.totalCount ?? 0;
          this.cdr.markForCheck();
        },
      });
  }

  loadMessages(silent = false): void {
    if (!silent) {
      this.loadingMessages = true;
      this.cdr.markForCheck();
    }

    this.messageApi
      .getMessageCriteria({
        ...this.params,
        keyword: this.selectedMenu === 'inbox' ? this.keyword.trim() : '',
      })
      .pipe(
        finalize(() => {
          this.loadingMessages = false;
          this.lastRefreshedAt = new Date();
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
          this.mails = res.data?.items ?? [];
          this.inboxTotalCount = res.data?.totalCount ?? 0;
          this.cdr.markForCheck();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load messages.',
          });
        },
      });
  }

  loadBroadcasts(silent = false): void {
    if (!silent) {
      this.loadingBroadcasts = true;
      this.cdr.markForCheck();
    }

    this.broadcastApi
      .getBroadcasts({
        keyword: this.selectedMenu === 'broadcasts' ? this.keyword.trim() : '',
        pageNumber: this.params.pageNumber ?? 1,
        pageSize: this.params.pageSize ?? 10,
      })
      .pipe(
        finalize(() => {
          this.loadingBroadcasts = false;
          this.lastRefreshedAt = new Date();
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
          this.broadcasts = res.data?.items ?? [];
          this.broadcastTotalCount = res.data?.totalCount ?? 0;
          this.cdr.markForCheck();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load broadcasts.',
          });
        },
      });
  }

  onSearch(): void {
    this.params = {
      ...this.params,
      pageNumber: 1,
      keyword: this.keyword.trim(),
    };

    if (this.selectedMenu === 'broadcasts') {
      this.loadBroadcasts();
    } else {
      this.loadMessages();
    }
  }

  onPageChange(event: PaginatorState): void {
    this.params = {
      ...this.params,
      pageNumber: (event.page ?? 0) + 1,
      pageSize: event.rows ?? 10,
    };

    if (this.selectedMenu === 'broadcasts') {
      this.loadBroadcasts();
    } else {
      this.loadMessages();
    }
  }

  onSelectMenu(menu: MailSidebarKey): void {
    this.selectedMenu = menu;
    this.keyword = '';
    this.params = {
      ...this.params,
      keyword: '',
      pageNumber: 1,
    };

    if (menu === 'broadcasts') {
      this.loadBroadcasts();
    } else {
      this.loadMessages();
    }

    this.cdr.markForCheck();
  }

  openMail(mail: IMail): void {
    this.router.navigate(['/admin/messages', mail.id]);
  }

  goToCreateBroadcast(): void {
    this.router.navigate(['/admin/messages/broadcasts/create']);
  }

  editBroadcast(item: IBroadcastItem, event?: Event): void {
    event?.stopPropagation();

    if (this.isBroadcastSent(item)) return;

    this.router.navigate(['/admin/messages/broadcasts', item.id, 'edit']);
  }

  sendBroadcastItem(item: IBroadcastItem, event?: Event): void {
    event?.stopPropagation();

    if (this.isBroadcastSent(item) || this.sendingBroadcastId === item.id) {
      return;
    }

    this.confirmationService.confirm({
      header: 'Send broadcast',
      message: 'Are you sure you want to send this broadcast?',
      icon: 'pi pi-send',
      acceptLabel: 'Send',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.sendingBroadcastId = item.id;
        this.cdr.markForCheck();

        this.broadcastApi
          .updateBroadcast(item.id, {
            id: item.id,
            subject: item.subject ?? '',
            detail: item.detail ?? '',
            status: 'Sent',
            isPinned: item.isPinned ?? false,
            startDisplayAt: item.startDisplayDate ?? '',
            expireDisplayAt: item.expireDisplayDate ?? '',
          })
          .pipe(
            finalize(() => {
              this.sendingBroadcastId = null;
              this.cdr.markForCheck();
            }),
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Broadcast sent',
                detail: 'Broadcast has been sent successfully.',
              });
              this.loadBroadcasts();
              this.refreshSidebarCounts();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Send failed',
                detail: 'Unable to send broadcast.',
              });
            },
          });
      },
    });
  }

  deleteBroadcastItem(item: IBroadcastItem, event?: Event): void {
    event?.stopPropagation();

    if (this.isBroadcastSent(item) || this.deletingBroadcastId === item.id) {
      return;
    }

    this.confirmationService.confirm({
      header: 'Delete broadcast',
      message: 'Are you sure you want to delete this broadcast?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.deletingBroadcastId = item.id;
        this.cdr.markForCheck();

        this.broadcastApi
          .deleteBroadcast(item.id)
          .pipe(
            finalize(() => {
              this.deletingBroadcastId = null;
              this.cdr.markForCheck();
            }),
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Broadcast deleted successfully.',
              });

              const isLastItemOnPage = this.broadcasts.length === 1;
              const currentPage = this.params.pageNumber ?? 1;

              if (isLastItemOnPage && currentPage > 1) {
                this.params = {
                  ...this.params,
                  pageNumber: currentPage - 1,
                };
              }

              this.loadBroadcasts();
              this.refreshSidebarCounts();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Delete failed',
                detail: 'Unable to delete broadcast.',
              });
            },
          });
      },
    });
  }

  openReadersDialog(item: IBroadcastItem, event?: Event): void {
    event?.stopPropagation();

    this.selectedReadersBroadcast = item;
    this.broadcastReaders = [];
    this.broadcastReadersDialogVisible = true;
    this.broadcastReadersLoading = true;
    this.cdr.markForCheck();

    this.broadcastApi.getBroadcastReaders(item.id).subscribe({
      next: (res) => {
        this.broadcastReaders = res.data ?? [];
        this.broadcastReadersLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.broadcastReadersLoading = false;
        this.toast.add({
          severity: 'error',
          summary: 'Load failed',
          detail: 'Unable to load broadcast readers.',
        });
        this.cdr.markForCheck();
      },
    });
  }

  getPreview(mail: IMail): string {
    const html = mail.detail?.trim() || mail.message?.trim() || '';

    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  getBroadcastPreview(item: IBroadcastItem): string {
    const html = item.detail?.trim() || '';

    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  getInitials(fullName?: string | null): string {
    if (!fullName?.trim()) return 'NA';

    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';

    return `${first}${second}`.toUpperCase();
  }

  getStatusLabel(status?: string | null): string {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'draft':
        return 'Draft';
      case 'read':
        return 'Read';
      case 'replied':
        return 'Replied';
      case 'sent':
        return 'Sent';
      default:
        return status || 'General';
    }
  }

  getStatusSeverity(
    status?: string | null,
  ): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'draft':
        return 'secondary';
      case 'replied':
        return 'success';
      case 'read':
        return 'info';
      case 'sent':
        return 'warn';
      default:
        return 'secondary';
    }
  }

  isBroadcastSent(item: IBroadcastItem): boolean {
    return (item.status || '').trim().toLowerCase() === 'sent';
  }
}
