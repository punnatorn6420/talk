import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { MessageService } from 'primeng/api';
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
    TableModule,
  ],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesAdminViewComponent implements OnInit {
  private readonly messageApi = inject(_MessageService);
  private readonly toast = inject(MessageService);
  private readonly router = inject(Router);

  mails: IMail[] = [];
  totalCount = 0;
  loading = false;

  keyword = '';
  selectedMenu: MailSidebarKey = 'inbox';

  params: IMessageParams = {
    keyword: '',
    pageNumber: 1,
    pageSize: 10,
    sortField: 'postedAt',
    ascending: false,
  };

  readonly menuItems: { key: MailSidebarKey; label: string; icon: string }[] = [
    { key: 'inbox', label: 'Inbox', icon: 'pi pi-inbox' },
    // { key: 'starred', label: 'Starred', icon: 'pi pi-star' },
    // { key: 'important', label: 'Important', icon: 'pi pi-bookmark' },
    // { key: 'sent', label: 'Sent', icon: 'pi pi-send' },
    // { key: 'archived', label: 'Archived', icon: 'pi pi-file' },
    // { key: 'spam', label: 'Spam', icon: 'pi pi-ban' },
    // { key: 'trash', label: 'Trash', icon: 'pi pi-trash' },
  ];

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;

    this.messageApi
      .getMessageCriteria(this.params)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.mails = res.data?.items ?? [];
          this.totalCount = res.data?.totalCount ?? 0;
          console.log('Loaded mails:', this.mails);
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

  openMail(mail: IMail): void {
    this.router.navigate(['/messages', mail.id]);
  }

  getPreview(mail: IMail): string {
    return (
      mail.message?.trim() || mail.detail?.trim() || mail.reply?.trim() || '-'
    );
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
      case 'pending':
        return 'Pending';
      case 'read':
        return 'Read';
      case 'replied':
        return 'Replied';
      case 'important':
        return 'Important';
      case 'security':
        return 'Security';
      case 'urgent':
        return 'Urgent';
      default:
        return status;
    }
  }

  getStatusClass(status?: string | null): string {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'replied':
        return 'mail-chip mail-chip--green';
      case 'pending':
        return 'mail-chip mail-chip--amber';
      case 'read':
        return 'mail-chip mail-chip--slate';
      case 'urgent':
        return 'mail-chip mail-chip--red';
      case 'security':
        return 'mail-chip mail-chip--blue';
      default:
        return 'mail-chip mail-chip--slate';
    }
  }

  formatTime(value?: string | null): string {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    const now = new Date();
    const sameDay =
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate();

    if (sameDay) {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
    }).format(date);
  }

  trackByMail(_: number, item: IMail): string | number {
    return item.id;
  }
}
