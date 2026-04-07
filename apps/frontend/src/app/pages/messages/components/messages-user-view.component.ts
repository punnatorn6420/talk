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
            if (latest) {
              this.selectedMail = latest;
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
      status: 'pending',
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
    this.detailLoading = true;

    this.messageApi
      .getMessageThreadById(id)
      .pipe(
        finalize(() => {
          this.detailLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
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
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load message detail.',
          });
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
      case 'pending':
        return 'Pending';
      case 'read':
        return 'Read';
      case 'replied':
        return 'Replied';
      default:
        return normalized ? status || 'Pending' : 'Pending';
    }
  }

  getStatusClass(status?: string | null): string {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'replied':
        return 'bg-emerald-100 text-emerald-700';
      case 'read':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-amber-100 text-amber-700';
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
}
