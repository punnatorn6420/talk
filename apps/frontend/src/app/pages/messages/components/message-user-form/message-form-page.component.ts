import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { _MessageService } from '../../../../service/message.service';
import { IMail, IMessageAttachment } from '../../../../types/message.model';
import { SubscriptionDestroyer } from '../../../../shared/core/helper/SubscriptionDestroyer.helper';

type PageMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-message-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    EditorModule,
    FileUploadModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './message-form-page.component.html',
  styleUrl: './message-form-page.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageFormPageComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly messageApi = inject(_MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  saving = false;

  pageMode: PageMode = 'create';
  isEditMode = false;
  messageId: string | null = null;

  pendingFiles: File[] = [];
  existingAttachments: IMessageAttachment[] = [];

  userAttachments: IMessageAttachment[] = [];
  ceoAttachments: IMessageAttachment[] = [];

  private readonly maxFileSize = 10 * 1024 * 1024;

  status = 'draft';

  reply = '';
  repliedAt: string | null = null;
  modifiedBy = '';

  messagedetail: IMail | null = null;

  readonly form = this.fb.nonNullable.group({
    subject: ['', Validators.required],
    detail: ['', Validators.required],
  });

  ngOnInit(): void {
    this.messageId = this.route.snapshot.paramMap.get('id');

    const routePath = this.route.snapshot.url.map((item) => item.path);
    const isViewRoute = routePath.includes('view');

    if (!this.messageId) {
      this.pageMode = 'create';
    } else if (isViewRoute) {
      this.pageMode = 'view';
    } else {
      this.pageMode = 'edit';
    }

    this.isEditMode = this.pageMode === 'edit';

    if (this.messageId) {
      this.loadDetail(this.messageId);
    }
  }

  loadDetail(id: string): void {
    this.loading = true;

    const obs = this.messageApi
      .getMessageThreadById(id)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
          const data = res.data;

          if (!data) {
            this.toast.add({
              severity: 'warn',
              summary: 'Not found',
              detail: 'Message detail is unavailable.',
            });
            this.router.navigate(['/admin/messages']);
            return;
          }

          this.form.reset({
            subject: data.subject ?? '',
            detail: data.detail ?? data.message ?? '',
          });

          this.status = data.status ?? 'draft';

          this.reply = data.reply ?? '';
          this.repliedAt = data.repliedAt ?? null;
          this.modifiedBy = data.modifiedBy ?? 'CEO/Admin';

          this.userAttachments = [...(data.userAttachments ?? [])];
          this.ceoAttachments = [...(data.ceoAttachments ?? [])];

          /**
           * Existing attachments are user attachments.
           * In edit mode, these can be deleted only when editable.
           * In view mode, these are shown as download-only.
           */
          this.existingAttachments = [...this.userAttachments];

          this.messagedetail = data;
          this.cdr.markForCheck();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load message detail.',
          });
          this.router.navigate(['/admin/messages']);
        },
      });
    this.AddSubscription(obs);
  }

  onFilesSelected(event: FileSelectEvent): void {
    if (this.isReadonly) return;

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
    if (this.isReadonly) return;

    this.pendingFiles = this.pendingFiles.filter((_, i) => i !== index);
    this.cdr.markForCheck();
  }

  removeExistingAttachment(index: number): void {
    if (this.isReadonly) return;
    if (!this.messageId) return;

    const file = this.existingAttachments[index];
    if (!file) return;

    const obs = this.messageApi
      .deleteMessageAttachment(this.messageId, file.id)
      .subscribe({
        next: () => {
          this.existingAttachments = this.existingAttachments.filter(
            (_, i) => i !== index,
          );

          this.userAttachments = this.userAttachments.filter(
            (item) => item.id !== file.id,
          );

          this.toast.add({
            severity: 'success',
            summary: 'Removed',
            detail: 'Attachment removed successfully.',
          });

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
    this.AddSubscription(obs);
  }

  submit(): void {
    if (this.isReadonly) return;

    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('subject', this.form.controls.subject.value.trim());
    formData.append('detail', this.form.controls.detail.value.trim());
    formData.append('status', 'draft');

    this.pendingFiles.forEach((file) => {
      formData.append('attachments', file, file.name);
    });

    this.saving = true;

    const request$ =
      this.pageMode === 'edit' && this.messageId
        ? this.messageApi.putMessageThreadWithFiles(this.messageId, formData)
        : this.messageApi.postMessageThreadWithFiles(formData);

    const obs = request$
      .pipe(
        finalize(() => {
          this.saving = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: this.pageMode === 'edit' ? 'Updated' : 'Created',
            detail:
              this.pageMode === 'edit'
                ? 'Your message has been updated.'
                : 'Your message has been created.',
          });

          this.router.navigate(['/admin/messages']);
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary:
              this.pageMode === 'edit' ? 'Update failed' : 'Create failed',
            detail:
              this.pageMode === 'edit'
                ? 'Unable to update your message.'
                : 'Unable to create your message.',
          });
        },
      });
    this.AddSubscription(obs);
  }

  downloadUserAttachment(file: IMessageAttachment): void {
    if (!this.messageId) return;
    this.downloadAttachment(this.messageId, file);
  }

  downloadCeoAttachment(file: IMessageAttachment): void {
    if (!this.messageId) return;
    this.downloadAttachment(this.messageId, file);
  }

  private downloadAttachment(
    messageId: string,
    file: IMessageAttachment,
  ): void {
    const obs = this.messageApi
      .downloadMessageAttachment(messageId, file.id)
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');

          anchor.href = url;
          anchor.download = file.fileName ?? 'attachment';
          anchor.click();

          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Download failed',
            detail: 'Unable to download attachment.',
          });
        },
      });
    this.AddSubscription(obs);
  }

  goBack(): void {
    this.router.navigate(['/admin/messages']);
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

  get isReadonly(): boolean {
    return this.pageMode === 'view' || this.status.toLowerCase() !== 'draft';
  }

  get pageTitle(): string {
    if (this.pageMode === 'view') return 'View Message';
    if (this.pageMode === 'edit') return 'Edit Message';
    return 'New Message';
  }

  get pageDescription(): string {
    if (this.pageMode === 'view') {
      return 'Read message detail and CEO reply.';
    }

    if (this.pageMode === 'edit') {
      return this.isReadonly
        ? 'This message is no longer editable.'
        : 'Update your draft message before sending.';
    }

    return 'Create a new message to admin.';
  }

  get hasCeoReply(): boolean {
    return this.status.toLowerCase() === 'replied' && !!this.reply?.trim();
  }

  get displayModifiedBy(): string {
    return this.modifiedBy || 'CEO/Admin';
  }
}
