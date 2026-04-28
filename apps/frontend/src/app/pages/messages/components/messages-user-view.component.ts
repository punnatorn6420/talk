import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { _MessageService } from '../../../service/message.service';
import { _BroadcastService } from '../../../service/broadcast.service';
import { SubscriptionDestroyer } from '../../../shared/core/helper/SubscriptionDestroyer.helper';
import { IMail, IMessageParams } from '../../../types/message.model';
import { IBroadcastItem } from '../../../types/broadcast.model';
import { DateTimePipe } from '../../../shared/core/pipes/date-time.pipe';

type InboxMenu = 'messages' | 'broadcasts';

@Component({
  selector: 'app-messages-user-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    TableModule,
    CardModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    ConfirmDialogModule,
    DateTimePipe,
  ],
  templateUrl: './messages-user-view.component.html',
  styleUrls: ['./messages-user-view.component.scss'],
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesUserViewComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  private readonly messageApi = inject(_MessageService);
  private readonly broadcastApi = inject(_BroadcastService);
  private readonly toast = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly confirmationService = inject(ConfirmationService);

  selectedMenu: InboxMenu = 'messages';

  mails: IMail[] = [];
  broadcasts: IBroadcastItem[] = [];

  loading = false;
  broadcastLoading = false;

  sendingId: string | number | null = null;
  deletingId: string | number | null = null;

  messageTotalCount = 0;
  broadcastTotalCount = 0;

  lastRefreshedAt: Date | null = null;

  readonly menuItems = [
    { key: 'messages' as InboxMenu, label: 'My Messages', icon: 'pi pi-inbox' },
    {
      key: 'broadcasts' as InboxMenu,
      label: 'Broadcasts',
      icon: 'pi pi-megaphone',
    },
  ];

  messageParams: IMessageParams = {
    keyword: '',
    pageNumber: 1,
    pageSize: 10,
    sortField: 'postedAt',
    ascending: false,
  };

  broadcastParams: IMessageParams = {
    keyword: '',
    pageNumber: 1,
    pageSize: 10,
    sortField: 'createdAt',
    ascending: false,
  };

  ngOnInit(): void {
    this.selectedMenu = this.resolveMenuFromQuery(
      this.route.snapshot.queryParamMap.get('menu'),
    );

    this.loadMessages();
    this.loadBroadcasts();
  }

  private resolveMenuFromQuery(menu: string | null): InboxMenu {
    return menu === 'broadcasts' ? 'broadcasts' : 'messages';
  }

  get keyword(): string {
    return this.selectedMenu === 'messages'
      ? (this.messageParams.keyword ?? '')
      : (this.broadcastParams.keyword ?? '');
  }

  set keyword(value: string) {
    if (this.selectedMenu === 'messages') {
      this.messageParams = { ...this.messageParams, keyword: value };
    } else {
      this.broadcastParams = { ...this.broadcastParams, keyword: value };
    }
  }

  get params(): IMessageParams {
    return this.selectedMenu === 'messages'
      ? this.messageParams
      : this.broadcastParams;
  }

  get totalCount(): number {
    return this.selectedMenu === 'messages'
      ? this.messageTotalCount
      : this.broadcastTotalCount;
  }

  onSelectMenu(menu: InboxMenu): void {
    this.selectedMenu = menu;
    this.cdr.markForCheck();
  }

  goToCreateMessage(): void {
    this.router.navigate(['/admin/messages/create'], {
      queryParams: { menu: 'messages' },
    });
  }

  editMail(mail: IMail, event?: Event): void {
    event?.stopPropagation();
    this.router.navigate(['/admin/messages', mail.id, 'edit'], {
      queryParams: { menu: 'messages' },
    });
  }

  loadMessages(showToast = false): void {
    this.loading = true;

    const obs = this.messageApi
      .getMessageCriteria(this.messageParams)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.lastRefreshedAt = new Date();
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
          this.mails = res.data?.items ?? [];
          this.messageTotalCount = res.data?.totalCount ?? 0;

          if (showToast) {
            this.toast.add({
              severity: 'success',
              summary: 'Refreshed',
              detail: 'Messages updated successfully.',
            });
          }

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
    this.AddSubscription(obs);
  }

  loadBroadcasts(showToast = false): void {
    this.broadcastLoading = true;

    const obs = this.broadcastApi
      .getMyBroadcasts(this.broadcastParams)
      .pipe(
        finalize(() => {
          this.broadcastLoading = false;
          this.lastRefreshedAt = new Date();
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
          const items = Array.isArray(res.data) ? res.data : [];
          this.broadcasts = items;
          this.broadcastTotalCount = items.length;

          if (showToast) {
            this.toast.add({
              severity: 'success',
              summary: 'Refreshed',
              detail: 'Broadcasts updated successfully.',
            });
          }

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
    this.AddSubscription(obs);
  }

  onSearch(): void {
    if (this.selectedMenu === 'messages') {
      this.messageParams = {
        ...this.messageParams,
        keyword: (this.messageParams.keyword ?? '').trim(),
        pageNumber: 1,
      };
      this.loadMessages();
      return;
    }

    this.broadcastParams = {
      ...this.broadcastParams,
      keyword: (this.broadcastParams.keyword ?? '').trim(),
      pageNumber: 1,
    };
    this.loadBroadcasts();
  }

  onPageChange(event: PaginatorState): void {
    if (this.selectedMenu === 'messages') {
      this.messageParams = {
        ...this.messageParams,
        pageNumber: (event.page ?? 0) + 1,
        pageSize: event.rows ?? 10,
      };
      this.loadMessages();
      return;
    }

    this.broadcastParams = {
      ...this.broadcastParams,
      pageNumber: (event.page ?? 0) + 1,
      pageSize: event.rows ?? 10,
    };
    this.loadBroadcasts();
  }

  refreshCurrentMenu(showToast = false): void {
    if (this.selectedMenu === 'messages') {
      this.loadMessages(showToast);
      return;
    }

    this.loadBroadcasts(showToast);
  }

  canEdit(mail: IMail): boolean {
    return (mail.status || '').trim().toLowerCase() === 'draft';
  }

  canDelete(mail: IMail): boolean {
    return (mail.status || '').trim().toLowerCase() === 'draft';
  }

  canSend(mail: IMail): boolean {
    return (mail.status || '').trim().toLowerCase() === 'draft';
  }

  sendMail(mail: IMail, event?: Event): void {
    event?.stopPropagation();

    if (!mail?.id || this.sendingId || !this.canSend(mail)) {
      return;
    }

    const selectedId = String(mail.id);

    this.confirmationService.confirm({
      header: 'Send draft message',
      message: 'Are you sure you want to send this draft message?',
      icon: 'pi pi-send',
      acceptLabel: 'Send',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.sendingId = selectedId;
        this.cdr.markForCheck();

        const obs = this.messageApi
          .putSentMessage(selectedId)
          .pipe(
            finalize(() => {
              this.sendingId = null;
              this.cdr.markForCheck();
            }),
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sent',
                detail: 'Your draft message has been sent.',
              });

              this.loadMessages();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Send failed',
                detail: 'Unable to send this draft message.',
              });
            },
          });
        this.AddSubscription(obs);
      },
    });
  }

  deleteMail(mail: IMail, event?: Event): void {
    event?.stopPropagation();

    if (!mail?.id || this.deletingId || !this.canDelete(mail)) {
      return;
    }

    const selectedId = String(mail.id);

    this.confirmationService.confirm({
      header: 'Delete message',
      message: 'Are you sure you want to delete this message?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deletingId = selectedId;
        this.cdr.markForCheck();

        const obs = this.messageApi
          .deleteMessageThread(selectedId)
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
                detail: 'Your message has been deleted.',
              });

              const isLastItemOnPage = this.mails.length === 1;
              const currentPage = this.messageParams.pageNumber ?? 1;

              if (isLastItemOnPage && currentPage > 1) {
                this.messageParams = {
                  ...this.messageParams,
                  pageNumber: currentPage - 1,
                };
              }

              this.loadMessages();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Delete failed',
                detail: 'Unable to delete this message.',
              });
            },
          });
        this.AddSubscription(obs);
      },
    });
  }

  getInitials(fullName?: string | null): string {
    if (!fullName?.trim()) return 'NA';

    return fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  getPreview(mail: IMail): string {
    const html = mail.detail?.trim() || mail.message?.trim() || '';
    if (!html) return '-';

    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  getBroadcastPreview(item: IBroadcastItem): string {
    const html = item.detail?.trim() || '';
    if (!html) return '-';

    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  getStatusLabel(status?: string | null): string {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'draft':
        return 'Draft';
      case 'sent':
        return 'Sent';
      case 'read':
        return 'Read';
      case 'replied':
        return 'Replied';
      default:
        return status || '-';
    }
  }

  getStatusSeverity(
    status?: string | null,
  ): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'draft':
        return 'secondary';
      case 'sent':
        return 'warn';
      case 'read':
        return 'info';
      case 'replied':
        return 'success';
      default:
        return 'secondary';
    }
  }

  getStatusBroadcastLabel(status?: string | null): string {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'draft':
        return 'Draft';
      case 'sent':
        return 'Sent';
      case 'read':
        return 'Read';
      case 'replied':
        return 'Replied';
      default:
        return status || '-';
    }
  }

  getStatusBroadcastSeverity(
    status?: string | null,
  ): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'draft':
        return 'secondary';
      case 'sent':
        return 'warn';
      case 'read':
        return 'info';
      case 'replied':
        return 'success';
      default:
        return 'secondary';
    }
  }

  openBroadcast(item: IBroadcastItem): void {
    this.router.navigate(['/admin/messages/broadcasts', item.id, 'view'], {
      queryParams: { menu: 'broadcasts' },
    });
  }

  openMessage(item: IMail): void {
    this.router.navigate(['/admin/messages', item.id, 'view'], {
      queryParams: { menu: 'messages' },
    });
  }
}
