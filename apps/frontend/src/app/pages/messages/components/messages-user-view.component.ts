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
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { _MessageService } from '../../../service/message.service';
import { SubscriptionDestroyer } from '../../../shared/core/helper/SubscriptionDestroyer.helper';
import {
  IMail,
  IMessageParams,
  IMessageRequest,
} from '../../../types/message.model';
import { ScrollPanelModule } from 'primeng/scrollpanel';

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
    TextareaModule,
    TagModule,
    ToastModule,
    PaginatorModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    ScrollPanelModule,
  ],
  templateUrl: './messages-user-view.component.html',
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesUserViewComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly messageApi = inject(_MessageService);
  private readonly toast = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly confirmationService = inject(ConfirmationService);

  mails: IMail[] = [];
  totalCount = 0;
  loading = false;
  creating = false;
  updating = false;
  sendingId: string | number | null = null;
  deletingId: string | number | null = null;
  detailLoading = false;

  selectedMail: IMail | null = null;
  editingMailId: string | null = null;

  keyword = '';

  params: IMessageParams = {
    keyword: '',
    pageNumber: 1,
    pageSize: 10,
    sortField: 'postedAt',
    ascending: false,
  };

  private detailRequestSeq = 0;

  readonly messageForm = this.fb.nonNullable.group({
    subject: ['', [Validators.required, Validators.maxLength(150)]],
    detail: ['', [Validators.required, Validators.maxLength(2500)]],
  });

  ngOnInit(): void {
    this.loadMyMessages();
  }

  loadMyMessages(): void {
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

          if (this.selectedMail?.id) {
            const latest = this.mails.find(
              (mail) => String(mail.id) === String(this.selectedMail?.id),
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

          this.cdr.markForCheck();
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

  onSearch(): void {
    this.params = {
      ...this.params,
      keyword: this.keyword.trim(),
      pageNumber: 1,
    };
    this.loadMyMessages();
  }

  onPageChange(event: PaginatorState): void {
    this.params = {
      ...this.params,
      pageNumber: (event.page ?? 0) + 1,
      pageSize: event.rows ?? 10,
    };
    this.loadMyMessages();
  }

  onSelectMessage(mail: IMail): void {
    this.editingMailId = null;
    this.messageForm.reset({ subject: '', detail: '' });
    this.selectedMail = null;
    this.loadMessageDetail(String(mail.id));
  }

  startCreate(): void {
    this.selectedMail = null;
    this.editingMailId = null;
    this.messageForm.reset({ subject: '', detail: '' });
    this.messageForm.markAsPristine();
    this.cdr.markForCheck();
  }

  startEdit(): void {
    if (!this.selectedMail) return;

    this.editingMailId = String(this.selectedMail.id);
    this.messageForm.reset({
      subject: this.selectedMail.subject ?? '',
      detail: this.getBody(this.selectedMail),
    });
    this.messageForm.markAsPristine();
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.editingMailId = null;
    this.messageForm.reset({ subject: '', detail: '' });
    this.cdr.markForCheck();
  }

  submitCreate(): void {
    if (this.messageForm.invalid || this.creating) {
      this.messageForm.markAllAsTouched();
      return;
    }

    const payload: IMessageRequest = {
      subject: this.messageForm.controls.subject.value.trim(),
      detail: this.messageForm.controls.detail.value.trim(),
      status: 'draft',
    };

    this.creating = true;

    this.messageApi
      .postMessageThread(payload)
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
            summary: 'Sent',
            detail: 'Your message has been submitted.',
          });
          this.startCreate();
          this.loadMyMessages();
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

    const payload: IMessageRequest = {
      subject: this.messageForm.controls.subject.value.trim(),
      detail: this.messageForm.controls.detail.value.trim(),
      status: this.selectedMail.status || 'pending',
    };

    this.updating = true;

    this.messageApi
      .putMessageThread(this.editingMailId, payload)
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

          const id = this.editingMailId;
          this.editingMailId = null;
          if (id) this.loadMessageDetail(id);
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
              this.startCreate();
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
    this.cdr.markForCheck();

    this.messageApi
      .getMessageThreadById(id)
      .pipe(
        finalize(() => {
          if (requestSeq === this.detailRequestSeq) {
            this.detailLoading = false;
            this.cdr.markForCheck();
          }
        }),
      )
      .subscribe({
        next: (res) => {
          if (requestSeq !== this.detailRequestSeq) return;

          this.selectedMail = res.data ?? null;

          if (!this.selectedMail) {
            this.toast.add({
              severity: 'warn',
              summary: 'Not found',
              detail: 'Message detail is unavailable.',
            });
          }

          this.cdr.markForCheck();
        },
        error: () => {
          if (requestSeq !== this.detailRequestSeq) return;

          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load message detail.',
          });

          this.selectedMail = null;
          this.cdr.markForCheck();
        },
      });
  }

  getBody(mail: IMail): string {
    return mail.detail?.trim() || mail.message?.trim() || '';
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

  formatDate(value?: string | null): string {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
}
