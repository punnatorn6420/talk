import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditorModule } from 'primeng/editor';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { _MessageService } from '../../../service/message.service';
import { _BroadcastService } from '../../../service/broadcast.service';
import { SubscriptionDestroyer } from '../../../shared/core/helper/SubscriptionDestroyer.helper';
import {
  IMail,
  IMessageAttachment,
  IMessageParams,
  IMessageRequest,
} from '../../../types/message.model';
import { IBroadcastItem, IBroadcast } from '../../../types/broadcast.model';
import { SkeletonLoadingModule } from '../../../shared/skeleton-loading/skeleton-loading.module';
import { DateTimePipe } from '../../../shared/core/pipes/date-time.pipe';

type PanelMode = 'empty' | 'create' | 'edit' | 'detail';
type InboxTab = 'messages' | 'broadcasts';

@Component({
  selector: 'app-messages-user-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TagModule,
    ToastModule,
    PaginatorModule,
    ConfirmDialogModule,
    ScrollPanelModule,
    EditorModule,
    FileUploadModule,
    SkeletonLoadingModule,
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
  private readonly fb = inject(FormBuilder);
  private readonly messageApi = inject(_MessageService);
  private readonly broadcastApi = inject(_BroadcastService);
  private readonly toast = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly confirmationService = inject(ConfirmationService);

  activeTab: InboxTab = 'messages';

  // message states
  mails: IMail[] = [];
  messageTotalCount = 0;
  loading = false;
  creating = false;
  updating = false;
  sendingId: string | number | null = null;
  deletingId: string | number | null = null;
  detailLoading = false;

  selectedMail: IMail | null = null;
  selectedMailId: string | number | null = null;
  editingMailId: string | null = null;
  panelMode: PanelMode = 'empty';

  pendingFiles: File[] = [];
  existingAttachments: IMessageAttachment[] = [];

  messageParams: IMessageParams = {
    keyword: '',
    pageNumber: 1,
    pageSize: 10,
    sortField: 'postedAt',
    ascending: false,
  };

  // broadcast states
  broadcasts: IBroadcastItem[] = [];
  broadcastTotalCount = 0;
  broadcastLoading = false;
  broadcastDetailLoading = false;
  selectedBroadcast: IBroadcastItem | null = null;
  selectedBroadcastId: number | null = null;

  broadcastParams: IMessageParams = {
    keyword: '',
    pageNumber: 1,
    pageSize: 10,
    sortField: 'createdAt',
    ascending: false,
  };

  private detailRequestSeq = 0;
  private readonly maxFileSize = 10 * 1024 * 1024;

  readonly messageForm = this.fb.nonNullable.group({
    subject: ['', Validators.required],
    detail: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadMyMessages();
    this.loadMyBroadcasts();
  }

  get isComposeMode(): boolean {
    return this.panelMode === 'create' || this.panelMode === 'edit';
  }

  get keyword(): string {
    return this.activeTab === 'messages'
      ? (this.messageParams.keyword ?? '')
      : (this.broadcastParams.keyword ?? '');
  }

  set keyword(value: string) {
    if (this.activeTab === 'messages') {
      this.messageParams = { ...this.messageParams, keyword: value };
    } else {
      this.broadcastParams = { ...this.broadcastParams, keyword: value };
    }
  }

  get currentRows(): number {
    return this.activeTab === 'messages'
      ? (this.messageParams.pageSize ?? 10)
      : (this.broadcastParams.pageSize ?? 10);
  }

  get currentFirst(): number {
    const params =
      this.activeTab === 'messages' ? this.messageParams : this.broadcastParams;

    return ((params.pageNumber ?? 1) - 1) * (params.pageSize ?? 10);
  }

  get currentTotalCount(): number {
    return this.activeTab === 'messages'
      ? this.messageTotalCount
      : this.broadcastTotalCount;
  }

  onTabChange(tab: InboxTab): void {
    this.activeTab = tab;

    if (tab === 'messages') {
      if (!this.mails.length) this.loadMyMessages();
    } else {
      if (!this.broadcasts.length) this.loadMyBroadcasts();
    }

    this.cdr.markForCheck();
  }

  // ----------------------------
  // Messages
  // ----------------------------
  loadMyMessages(): void {
    this.loading = true;

    this.messageApi
      .getMessageCriteria(this.messageParams)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
          this.mails = res.data?.items ?? [];
          this.messageTotalCount = res.data?.totalCount ?? 0;

          if (this.selectedMailId != null) {
            const latest = this.mails.find(
              (mail) => String(mail.id) === String(this.selectedMailId),
            );

            if (latest && this.selectedMail) {
              this.selectedMail = {
                ...this.selectedMail,
                subject: latest.subject,
                status: latest.status,
                postedAt: latest.postedAt,
                repliedAt: latest.repliedAt,
                fullName: latest.fullName,
                email: latest.email,
              };
            }
          }

          if (
            !this.mails.length &&
            this.activeTab === 'messages' &&
            this.panelMode === 'detail'
          ) {
            this.panelMode = 'empty';
            this.selectedMail = null;
            this.selectedMailId = null;
          }

          this.cdr.detectChanges();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load your messages.',
          });
          this.cdr.markForCheck();
        },
      });
  }

  onSelectMessage(mail: IMail): void {
    this.editingMailId = null;
    this.pendingFiles = [];
    this.selectedMailId = mail.id;
    this.selectedMail = { ...mail };
    this.panelMode = 'detail';
    this.detailLoading = true;

    this.cdr.detectChanges();
    this.loadMessageDetail(String(mail.id));
  }

  startCreate(): void {
    this.activeTab = 'messages';
    this.panelMode = 'create';
    this.selectedMail = null;
    this.selectedMailId = null;
    this.editingMailId = null;
    this.messageForm.reset({ subject: '', detail: '' });
    this.messageForm.markAsPristine();
    this.pendingFiles = [];
    this.existingAttachments = [];
    this.cdr.markForCheck();
  }

  startEdit(): void {
    if (!this.selectedMail) return;

    this.panelMode = 'edit';
    this.editingMailId = String(this.selectedMail.id);

    this.messageForm.reset({
      subject: this.selectedMail.subject ?? '',
      detail: this.getBody(this.selectedMail),
    });

    this.messageForm.markAsPristine();
    this.existingAttachments = [...(this.selectedMail.attachments ?? [])];
    this.pendingFiles = [];

    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.editingMailId = null;
    this.pendingFiles = [];
    this.existingAttachments = [];

    if (this.selectedMailId != null) {
      this.panelMode = 'detail';
    } else {
      this.panelMode = 'empty';
      this.selectedMail = null;
    }

    this.messageForm.reset({ subject: '', detail: '' });
    this.cdr.markForCheck();
  }

  onFilesSelected(event: FileSelectEvent): void {
    const files = event.files ?? [];

    for (const file of files) {
      if (file.size > this.maxFileSize) {
        this.toast.add({
          severity: 'warn',
          summary: 'File too large',
          detail: `${file.name} exceeds 10 MB.`,
        });
        continue;
      }

      const duplicated = this.pendingFiles.some(
        (item) =>
          item.name === file.name &&
          item.size === file.size &&
          item.lastModified === file.lastModified,
      );

      if (!duplicated) {
        this.pendingFiles = [...this.pendingFiles, file];
      }
    }

    this.cdr.markForCheck();
  }

  removePendingFile(index: number): void {
    this.pendingFiles = this.pendingFiles.filter((_, i) => i !== index);
    this.cdr.markForCheck();
  }

  private buildFormData(status: string): FormData {
    const formData = new FormData();

    formData.append('subject', this.messageForm.controls.subject.value.trim());
    formData.append('detail', this.messageForm.controls.detail.value.trim());
    formData.append('status', status);

    this.pendingFiles.forEach((file) => {
      formData.append('attachments', file, file.name);
    });

    return formData;
  }

  submitCreate(): void {
    if (this.messageForm.invalid || this.creating) {
      this.messageForm.markAllAsTouched();
      return;
    }

    this.creating = true;

    this.messageApi
      .postMessageThreadWithFiles(this.buildFormData('draft'))
      .pipe(
        finalize(() => {
          this.creating = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Your message has been saved.',
          });

          this.panelMode = 'empty';
          this.selectedMail = null;
          this.selectedMailId = null;
          this.editingMailId = null;
          this.pendingFiles = [];
          this.existingAttachments = [];
          this.messageForm.reset({ subject: '', detail: '' });

          this.loadMyMessages();
          this.cdr.detectChanges();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Send failed',
            detail: 'Unable to submit your message.',
          });
        },
      });
  }

  submitEdit(): void {
    if (
      !this.editingMailId ||
      this.messageForm.invalid ||
      this.updating ||
      !this.selectedMail
    ) {
      this.messageForm.markAllAsTouched();
      return;
    }

    this.updating = true;

    const formData = new FormData();
    formData.append('subject', this.messageForm.controls.subject.value.trim());
    formData.append('detail', this.messageForm.controls.detail.value.trim());
    formData.append('status', this.selectedMail.status || 'draft');

    this.pendingFiles.forEach((file) => {
      formData.append('attachments', file, file.name);
    });

    this.messageApi
      .putMessageThreadWithFiles(this.editingMailId, formData)
      .pipe(
        finalize(() => {
          this.updating = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Your message has been updated.',
          });

          this.pendingFiles = [];
          this.existingAttachments = [];
          this.editingMailId = null;
          this.panelMode = 'detail';

          this.loadMessageDetail(String(this.selectedMail?.id));
          this.loadMyMessages();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Update failed',
            detail: 'Unable to update your message.',
          });
        },
      });
  }

  deleteSelected(): void {
    if (!this.selectedMail?.id || this.deletingId) return;

    const selectedId = String(this.selectedMail.id);

    this.confirmationService.confirm({
      header: 'Delete message',
      message: 'Are you sure you want to delete this message?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.deletingId = selectedId;

        this.messageApi
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

              this.selectedMail = null;
              this.selectedMailId = null;
              this.panelMode = 'empty';
              this.pendingFiles = [];
              this.existingAttachments = [];
              this.messageForm.reset({ subject: '', detail: '' });

              this.loadMyMessages();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Delete failed',
                detail: 'Unable to delete this message.',
              });
            },
          });
      },
    });
  }

  private loadMessageDetail(id: string): void {
    const requestSeq = ++this.detailRequestSeq;

    this.detailLoading = true;
    this.cdr.detectChanges();

    this.messageApi.getMessageThreadById(id).subscribe({
      next: (res) => {
        if (requestSeq !== this.detailRequestSeq) return;

        const nextMail = res.data ?? null;
        this.selectedMail = nextMail;

        if (!this.selectedMail) {
          this.panelMode = 'empty';
          this.selectedMailId = null;
          this.toast.add({
            severity: 'warn',
            summary: 'Not found',
            detail: 'Message detail is unavailable.',
          });
        } else {
          this.panelMode = 'detail';
        }

        this.detailLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        if (requestSeq !== this.detailRequestSeq) return;

        this.toast.add({
          severity: 'error',
          summary: 'Load failed',
          detail: 'Unable to load message detail.',
        });

        this.selectedMail = null;
        this.selectedMailId = null;
        this.panelMode = 'empty';
        this.detailLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  sendDraftSelected(): void {
    if (
      !this.selectedMail?.id ||
      this.sendingId ||
      this.selectedMail.status?.toLowerCase() !== 'draft'
    ) {
      return;
    }

    const selectedId = String(this.selectedMail.id);

    const payload: IMessageRequest = {
      subject: this.selectedMail.subject?.trim() || '',
      detail: this.getBody(this.selectedMail),
      status: 'sent',
    };

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

        this.messageApi
          .putMessageThread(selectedId, payload)
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

              if (this.selectedMail) {
                this.selectedMail = {
                  ...this.selectedMail,
                  status: 'sent',
                };
              }

              this.loadMessageDetail(selectedId);
              this.loadMyMessages();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Send failed',
                detail: 'Unable to send this draft message.',
              });
            },
          });
      },
    });
  }

  loadMyBroadcasts(): void {
    this.broadcastLoading = true;

    this.broadcastApi
      .getMyBroadcasts(this.broadcastParams)
      .pipe(
        finalize(() => {
          this.broadcastLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
          const items = Array.isArray(res.data) ? res.data : [];

          this.broadcasts = items;
          this.broadcastTotalCount = items.length;

          if (!this.broadcasts.length && this.activeTab === 'broadcasts') {
            this.selectedBroadcast = null;
            this.selectedBroadcastId = null;
          }

          if (this.selectedBroadcastId != null) {
            const latest = this.broadcasts.find(
              (item) => item.id === this.selectedBroadcastId,
            );

            if (latest) {
              this.selectedBroadcast = { ...latest };
            }
          }

          this.cdr.markForCheck();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load broadcasts.',
          });
          this.cdr.markForCheck();
        },
      });
  }

  onSelectBroadcast(item: IBroadcastItem): void {
    this.selectedBroadcastId = item.id;
    this.selectedBroadcast = { ...item };
    this.broadcastDetailLoading = true;
    this.cdr.markForCheck();

    if (item.isRead) {
      this.broadcastDetailLoading = false;
      this.cdr.markForCheck();
      return;
    }

    this.broadcastApi
      .markBroadcastAsRead(item.id)
      .pipe(
        finalize(() => {
          this.broadcastDetailLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          this.broadcasts = this.broadcasts.map((broadcast) =>
            broadcast.id === item.id
              ? { ...broadcast, isRead: true }
              : broadcast,
          );

          if (this.selectedBroadcast?.id === item.id) {
            this.selectedBroadcast = {
              ...this.selectedBroadcast,
              isRead: true,
            };
          }

          this.cdr.markForCheck();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Read failed',
            detail: 'Unable to mark this broadcast as read.',
          });
        },
      });
  }

  // ----------------------------
  // Shared helpers
  // ----------------------------
  onSearch(): void {
    if (this.activeTab === 'messages') {
      this.messageParams = {
        ...this.messageParams,
        keyword: this.messageParams.keyword?.trim() ?? '',
        pageNumber: 1,
      };

      this.selectedMail = null;
      this.selectedMailId = null;
      this.panelMode = 'empty';
      this.loadMyMessages();
      return;
    }

    this.broadcastParams = {
      ...this.broadcastParams,
      keyword: this.broadcastParams.keyword?.trim() ?? '',
      pageNumber: 1,
    };

    this.selectedBroadcast = null;
    this.selectedBroadcastId = null;
    this.loadMyBroadcasts();
  }

  onPageChange(event: PaginatorState): void {
    if (this.activeTab === 'messages') {
      this.messageParams = {
        ...this.messageParams,
        pageNumber: (event.page ?? 0) + 1,
        pageSize: event.rows ?? 10,
      };
      this.loadMyMessages();
      return;
    }

    this.broadcastParams = {
      ...this.broadcastParams,
      pageNumber: (event.page ?? 0) + 1,
      pageSize: event.rows ?? 10,
    };
    this.loadMyBroadcasts();
  }

  getBody(mail: IMail): string {
    return mail.detail?.trim() || mail.message?.trim() || '';
  }

  getPlainTextPreview(mail: IMail): string {
    const html = this.getBody(mail);
    if (!html) return '';

    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  getBroadcastPreview(item: IBroadcastItem): string {
    const html = item.detail?.trim() || '';
    if (!html) return '';

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
        return normalized ? status || 'Draft' : 'Draft';
    }
  }

  getStatusClass(status?: string | null): string {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'sent':
        return 'bg-orange-100 text-orange-700';
      case 'read':
        return 'bg-blue-100 text-blue-700';
      case 'replied':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  getBroadcastReadLabel(item: IBroadcastItem): string {
    return item.isRead ? 'Read' : 'Unread';
  }

  getBroadcastReadClass(item: IBroadcastItem): string {
    return item.isRead
      ? 'bg-slate-100 text-slate-700'
      : 'bg-violet-100 text-violet-700';
  }

  hasAdminReply(mail: IMail | null): boolean {
    if (!mail) return false;

    return (
      !!mail.reply?.trim() || (mail.status || '').toLowerCase() === 'replied'
    );
  }

  shouldShowNoReply(mail: IMail | null): boolean {
    if (!mail) return false;

    const status = (mail.status || '').toLowerCase();
    return status !== 'draft' && !this.hasAdminReply(mail);
  }

  getAttachments(mail: IMail | null): IMessageAttachment[] {
    return mail?.attachments ?? [];
  }

  hasAttachments(mail: IMail | null): boolean {
    return this.getAttachments(mail).length > 0;
  }

  downloadAttachment(mail: IMail | null, attachment: IMessageAttachment): void {
    if (!mail?.id || !attachment?.id) return;

    this.messageApi
      .downloadMessageAttachment(mail.id, attachment.id)
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

  removeExistingAttachment(index: number): void {
    if (!this.editingMailId) return;

    const file = this.existingAttachments[index];
    if (!file) return;

    this.messageApi
      .deleteMessageAttachment(this.editingMailId, file.id)
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Removed',
            detail: 'Attachment removed successfully.',
          });

          this.existingAttachments = this.existingAttachments.filter(
            (_, i) => i !== index,
          );

          this.cdr.markForCheck();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Delete failed',
            detail: 'Unable to remove attachment.',
          });
        },
      });
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
