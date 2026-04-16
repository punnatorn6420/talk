import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
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
  ],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesAdminViewComponent implements OnInit {
  private readonly messageApi = inject(_MessageService);
  private readonly toast = inject(MessageService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly confirmationService = inject(ConfirmationService);

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
    { key: 'sent', label: 'Sent', icon: 'pi pi-send' },
  ];

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.messageApi
      .getMessageCriteria(this.params)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
          this.mails = res.data?.items ?? [];
          this.totalCount = res.data?.totalCount ?? 0;
          this.cdr.markForCheck();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load messages.',
          });
          this.cdr.markForCheck();
        },
      });
  }

  onSearch(): void {
    this.params = {
      ...this.params,
      keyword: this.keyword.trim(),
      pageNumber: 1,
    };
    this.loadMessages();
  }

  onPageChange(event: PaginatorState): void {
    this.params = {
      ...this.params,
      pageNumber: (event.page ?? 0) + 1,
      pageSize: event.rows ?? 10,
    };
    this.loadMessages();
  }

  onSelectMenu(menu: MailSidebarKey): void {
    this.selectedMenu = menu;
    this.cdr.markForCheck();

    // TODO: ถ้าภายหลังมี API/filter แยก inbox / sent ค่อยเติม logic ตรงนี้
  }

  openBroadcastDialog(): void {
    this.broadcastTo = 'All Users';
    this.broadcastSubject = '';
    this.broadcastMessage = '';
    this.broadcastFiles = [];
    this.broadcastDialogVisible = true;
    this.cdr.markForCheck();
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

    setTimeout(() => {
      this.sendingBroadcast = false;
      this.broadcastDialogVisible = false;

      this.toast.add({
        severity: 'success',
        summary: 'Broadcast created',
        detail: 'Broadcast draft is ready.',
      });

      this.cdr.markForCheck();
    }, 500);
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
}
