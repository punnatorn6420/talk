import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, forkJoin, interval, Subject, takeUntil } from 'rxjs';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { _MessageService } from '../../../service/message.service';
import { IMail, IMessageParams } from '../../../types/message.model';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { DateTimePipe } from '../../../shared/core/pipes/date-time.pipe';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import {
  IBroadcastItem,
  ICreateBroadcastRequest,
  IUpdateBroadcastRequest,
} from '../../../types/broadcast.model';
import { _BroadcastService } from '../../../service/broadcast.service';
import { SkeletonModule } from 'primeng/skeleton';
import { Menu, MenuModule } from 'primeng/menu';

type MailSidebarKey =
  | 'inbox'
  | 'starred'
  | 'important'
  | 'sent'
  | 'archived'
  | 'spam'
  | 'trash';

@Component({
  selector: 'app-messages-admin-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    PaginatorModule,
    ProgressSpinnerModule,
    InputGroupModule,
    InputGroupAddonModule,
    ConfirmDialogModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    CardModule,
    DateTimePipe,
    DialogModule,
    EditorModule,
    SkeletonModule,
    MenuModule,
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
  totalCount = 0;
  loading = false;
  deletingId: string | number | null = null;

  keyword = '';
  selectedMenu: MailSidebarKey = 'inbox';

  broadcastDialogVisible = false;
  sendingBroadcast = false;
  broadcastTo = 'All Users';
  broadcastSubject = '';
  broadcastMessage = '';

  broadcastFiles: File[] = [];
  private readonly maxBroadcastFileSize = 10 * 1024 * 1024;

  params: IMessageParams = {
    keyword: '',
    pageNumber: 1,
    pageSize: 10,
    sortField: 'postedAt',
    ascending: false,
  };

  readonly menuItems: { key: MailSidebarKey; label: string; icon: string }[] = [
    { key: 'inbox', label: 'Inbox', icon: 'pi pi-inbox' },
    { key: 'sent', label: 'Broadcasts', icon: 'pi pi-send' },
  ];

  broadcasts: IBroadcastItem[] = [];
  broadcastLoading = false;
  editingBroadcastId: number | null = null;

  inboxTotalCount = 0;
  broadcastTotalCount = 0;

  lastRefreshedAt: Date | null = null;
  private readonly minSkeletonMs = 2000;

  ngOnInit(): void {
    this.loadInitialCountsAndData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private finishWithMinimumDelay(
    startedAt: number,
    callback: () => void,
  ): void {
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, this.minSkeletonMs - elapsed);

    setTimeout(() => {
      callback();
      this.cdr.markForCheck();
    }, remaining);
  }

  refreshCurrentMenu(silent = false): void {
    if (silent) {
      this.loadInitialCountsAndDataSilent();
    } else {
      this.loadInitialCountsAndData();
    }
  }

  loadInitialCountsAndDataSilent(): void {
    forkJoin({
      messages: this.messageApi.getMessageCriteria({
        ...this.params,
        keyword: '',
        pageNumber: this.params.pageNumber ?? 1,
        pageSize: this.params.pageSize ?? 10,
      }),
      broadcasts: this.broadcastApi.getBroadcasts({
        keyword: '',
        pageNumber: this.params.pageNumber ?? 1,
        pageSize: this.params.pageSize ?? 10,
      }),
    }).subscribe({
      next: ({ messages, broadcasts }) => {
        this.mails = messages.data?.items ?? [];
        this.inboxTotalCount = messages.data?.totalCount ?? 0;

        this.broadcasts = broadcasts.data?.items ?? [];
        this.broadcastTotalCount = broadcasts.data?.totalCount ?? 0;

        this.totalCount =
          this.selectedMenu === 'sent'
            ? this.broadcastTotalCount
            : this.inboxTotalCount;

        this.lastRefreshedAt = new Date();

        this.cdr.markForCheck();
      },
      error: () => {
        this.toast.add({
          severity: 'error',
          summary: 'Refresh failed',
          detail: 'Unable to refresh data.',
        });
      },
    });
  }

  private startAutoRefresh(): void {
    interval(5 * 60 * 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshCurrentMenu(true);
      });
  }

  loadInitialCountsAndData(): void {
    const startedAt = Date.now();
    this.loading = true;
    this.broadcastLoading = true;

    forkJoin({
      messages: this.messageApi.getMessageCriteria({
        ...this.params,
        keyword: '',
        pageNumber: 1,
        pageSize: 10,
      }),
      broadcasts: this.broadcastApi.getBroadcasts({
        keyword: '',
        pageNumber: 1,
        pageSize: 10,
      }),
    }).subscribe({
      next: ({ messages, broadcasts }) => {
        this.finishWithMinimumDelay(startedAt, () => {
          this.mails = messages.data?.items ?? [];
          this.inboxTotalCount = messages.data?.totalCount ?? 0;

          this.broadcasts = broadcasts.data?.items ?? [];
          this.broadcastTotalCount = broadcasts.data?.totalCount ?? 0;

          this.totalCount =
            this.selectedMenu === 'sent'
              ? this.broadcastTotalCount
              : this.inboxTotalCount;

          this.lastRefreshedAt = new Date();
          this.loading = false;
          this.broadcastLoading = false;
        });
      },
      error: () => {
        this.finishWithMinimumDelay(startedAt, () => {
          this.loading = false;
          this.broadcastLoading = false;
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load menu counts.',
          });
        });
      },
    });
  }

  loadMessages(): void {
    const startedAt = Date.now();
    this.loading = true;

    this.messageApi.getMessageCriteria(this.params).subscribe({
      next: (res) => {
        this.finishWithMinimumDelay(startedAt, () => {
          this.mails = res.data?.items ?? [];
          this.inboxTotalCount = res.data?.totalCount ?? 0;

          if (this.selectedMenu === 'inbox') {
            this.totalCount = this.inboxTotalCount;
          }

          this.lastRefreshedAt = new Date();
          this.loading = false;
        });
      },
      error: () => {
        this.finishWithMinimumDelay(startedAt, () => {
          this.loading = false;
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load messages.',
          });
        });
      },
    });
  }

  onSearch(): void {
    this.params = {
      ...this.params,
      keyword: this.keyword.trim(),
      pageNumber: 1,
    };

    if (this.selectedMenu === 'sent') {
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

    if (this.selectedMenu === 'sent') {
      this.loadBroadcasts();
    } else {
      this.loadMessages();
    }
  }

  onSelectMenu(menu: MailSidebarKey): void {
    this.selectedMenu = menu;
    this.params = {
      ...this.params,
      pageNumber: 1,
    };

    if (menu === 'sent') {
      this.totalCount = this.broadcastTotalCount;
      this.loadBroadcasts();
    } else {
      this.totalCount = this.inboxTotalCount;
      this.loadMessages();
    }

    this.cdr.markForCheck();
  }

  editBroadcast(item: IBroadcastItem, event?: Event): void {
    event?.stopPropagation();

    this.editingBroadcastId = item.id;
    this.broadcastTo = 'All Users';
    this.broadcastSubject = item.subject ?? '';
    this.broadcastMessage = item.detail ?? '';
    this.broadcastFiles = [];
    this.broadcastDialogVisible = true;
    this.cdr.markForCheck();
  }

  openBroadcastDialog(): void {
    this.editingBroadcastId = null;
    this.broadcastTo = 'All Users';
    this.broadcastSubject = '';
    this.broadcastMessage = '';
    this.broadcastFiles = [];
    this.broadcastDialogVisible = true;
    this.cdr.markForCheck();
  }

  private buildCreateBroadcastPayload(): ICreateBroadcastRequest {
    return {
      subject: this.broadcastSubject.trim(),
      detail: this.broadcastMessage.trim(),
      status: 'Draft',
      isPinned: false,
      startDisplayAt: '',
      expireDisplayAt: '',
    };
  }

  closeBroadcastDialog(): void {
    this.broadcastDialogVisible = false;
    this.cdr.markForCheck();
  }

  sendBroadcast(): void {
    const plainText = this.broadcastMessage
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!this.broadcastSubject.trim()) {
      this.toast.add({
        severity: 'warn',
        summary: 'Subject required',
        detail: 'Please enter a broadcast subject.',
      });
      return;
    }

    if (!plainText) {
      this.toast.add({
        severity: 'warn',
        summary: 'Message required',
        detail: 'Please enter a broadcast message.',
      });
      return;
    }

    this.sendingBroadcast = true;
    this.cdr.markForCheck();

    const editingItem = this.getEditingBroadcast();

    const request$ =
      this.editingBroadcastId && editingItem
        ? this.broadcastApi.updateBroadcast(
            this.editingBroadcastId,
            this.buildUpdateBroadcastPayload(editingItem, {
              subject: this.broadcastSubject.trim(),
              detail: this.broadcastMessage.trim(),
            }),
            this.broadcastFiles,
          )
        : this.broadcastApi.createBroadcast(
            this.buildCreateBroadcastPayload(),
            this.broadcastFiles,
          );

    request$
      .pipe(
        finalize(() => {
          this.sendingBroadcast = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: this.editingBroadcastId ? 'Updated' : 'Created',
            detail: this.editingBroadcastId
              ? 'Broadcast updated successfully.'
              : 'Broadcast draft created successfully.',
          });

          this.broadcastDialogVisible = false;
          this.editingBroadcastId = null;
          this.broadcastFiles = [];

          if (this.selectedMenu === 'sent') {
            this.loadBroadcasts();
          }
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Save failed',
            detail: 'Unable to save broadcast.',
          });
        },
      });
  }

  openMail(mail: IMail): void {
    this.router.navigate(['/admin/messages', mail.id]);
  }

  onDeleteMail(id: string | number, event: Event): void {
    event.stopPropagation();

    if (!id || this.deletingId === id) return;

    this.confirmationService.confirm({
      header: 'Confirm delete',
      message: 'Are you sure you want to delete this message?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.deletingId = id;

        this.messageApi
          .deleteMessageThread(String(id))
          .pipe(
            finalize(() => {
              this.deletingId = null;
              this.cdr.markForCheck();
            }),
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Message deleted successfully.',
              });

              if (
                this.mails.length === 1 &&
                (this.params.pageNumber ?? 1) > 1
              ) {
                this.params = {
                  ...this.params,
                  pageNumber: (this.params.pageNumber ?? 1) - 1,
                };
              }

              this.loadMessages();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Delete failed',
                detail: 'Unable to delete message.',
              });
            },
          });
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

  getInitials(fullName?: string | null): string {
    if (!fullName?.trim()) return 'NA';

    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';

    return `${first}${second}`.toUpperCase();
  }

  getStatusLabel(status?: string | null): string {
    if (!status) return 'General';

    const normalized = status.trim().toLowerCase();

    switch (normalized) {
      case 'read':
        return 'Read';
      case 'replied':
        return 'Replied';
      case 'sent':
        return 'Sent';
      default:
        return status;
    }
  }

  getStatusClass(status?: string | null): string {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'draft':
        return 'mail-chip bg-gray-100 text-gray-700';
      case 'replied':
        return 'mail-chip bg-emerald-100 text-emerald-700';
      case 'read':
        return 'mail-chip bg-blue-100 text-blue-700';
      case 'sent':
        return 'mail-chip bg-orange-100 text-orange-700';
      default:
        return 'mail-chip bg-gray-100 text-gray-700';
    }
  }

  trackByMail(_: number, item: IMail): string | number {
    return item.id;
  }

  onBroadcastFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    for (const file of files) {
      if (file.size > this.maxBroadcastFileSize) {
        this.toast.add({
          severity: 'warn',
          summary: 'File too large',
          detail: `${file.name} exceeds 10 MB.`,
        });
        continue;
      }

      const duplicated = this.broadcastFiles.some(
        (item) =>
          item.name === file.name &&
          item.size === file.size &&
          item.lastModified === file.lastModified,
      );

      if (!duplicated) {
        this.broadcastFiles = [...this.broadcastFiles, file];
      }
    }

    input.value = '';
    this.cdr.markForCheck();
  }

  removeBroadcastFile(index: number): void {
    this.broadcastFiles = this.broadcastFiles.filter((_, i) => i !== index);
    this.cdr.markForCheck();
  }

  formatFileSize(size: number): string {
    if (!size) return '-';

    const units = ['B', 'KB', 'MB', 'GB'];
    let value = size;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }

  get isBroadcastMenu(): boolean {
    return this.selectedMenu === 'sent';
  }

  loadBroadcasts(): void {
    const startedAt = Date.now();
    this.broadcastLoading = true;

    this.broadcastApi
      .getBroadcasts({
        keyword: this.keyword.trim(),
        pageNumber: this.params.pageNumber ?? 1,
        pageSize: this.params.pageSize ?? 10,
      })
      .subscribe({
        next: (res) => {
          this.finishWithMinimumDelay(startedAt, () => {
            this.broadcasts = res.data?.items ?? [];
            this.broadcastTotalCount = res.data?.totalCount ?? 0;

            if (this.selectedMenu === 'sent') {
              this.totalCount = this.broadcastTotalCount;
            }

            this.lastRefreshedAt = new Date();
            this.broadcastLoading = false;
          });
        },
        error: () => {
          this.finishWithMinimumDelay(startedAt, () => {
            this.broadcastLoading = false;
            this.toast.add({
              severity: 'error',
              summary: 'Load failed',
              detail: 'Unable to load broadcasts.',
            });
          });
        },
      });
  }

  private getEditingBroadcast(): IBroadcastItem | null {
    if (!this.editingBroadcastId) return null;
    return (
      this.broadcasts.find((x) => x.id === this.editingBroadcastId) ?? null
    );
  }

  sendBroadcastItem(item: IBroadcastItem, event?: Event): void {
    event?.stopPropagation();

    this.broadcastApi
      .updateBroadcast(
        item.id,
        this.buildUpdateBroadcastPayload(item, {
          status: 'Sent',
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
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Send failed',
            detail: 'Unable to send broadcast.',
          });
        },
      });
  }

  deleteBroadcastItem(item: IBroadcastItem, event?: Event): void {
    event?.stopPropagation();

    this.confirmationService.confirm({
      header: 'Delete broadcast',
      message: 'Are you sure you want to delete this broadcast?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.broadcastApi.deleteBroadcast(item.id).subscribe({
          next: () => {
            this.toast.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Broadcast deleted successfully.',
            });
            this.loadBroadcasts();
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

  private buildUpdateBroadcastPayload(
    item: IBroadcastItem,
    overrides: Partial<IUpdateBroadcastRequest> = {},
  ): IUpdateBroadcastRequest {
    return {
      id: item.id,
      subject: overrides.subject ?? item.subject ?? '',
      detail: overrides.detail ?? item.detail ?? '',
      status: overrides.status ?? item.status ?? 'Draft',
      isPinned: overrides.isPinned ?? item.isPinned ?? false,
      startDisplayAt: overrides.startDisplayAt ?? item.startDisplayAt ?? '',
      expireDisplayAt: overrides.expireDisplayAt ?? item.expireDisplayAt ?? '',
    };
  }

  openBroadcastActionMenu(menu: Menu, event: Event): void {
    event.stopPropagation();
    menu.toggle(event);
  }

  getBroadcastActionItems(item: IBroadcastItem): MenuItem[] {
    const items: MenuItem[] = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editBroadcast(item),
      },
    ];

    if (item.status === 'Draft') {
      items.push({
        label: 'Send',
        icon: 'pi pi-send',
        command: () => this.sendBroadcastItem(item, new Event('click')),
      });
    }

    items.push({
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.deleteBroadcastItem(item, new Event('click')),
    });

    return items;
  }
}
