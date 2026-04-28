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
import { IMessageAttachment } from '../../../../types/message.model';

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
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly messageApi = inject(_MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  saving = false;
  isEditMode = false;
  messageId: string | null = null;

  pendingFiles: File[] = [];
  existingAttachments: IMessageAttachment[] = [];
  private readonly maxFileSize = 10 * 1024 * 1024;

  status = '';

  readonly form = this.fb.nonNullable.group({
    subject: ['', Validators.required],
    detail: ['', Validators.required],
  });

  ngOnInit(): void {
    this.messageId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.messageId;

    if (this.isEditMode && this.messageId) {
      this.loadDetail(this.messageId);
    }
  }

  loadDetail(id: string): void {
    this.loading = true;

    this.messageApi
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
            this.router.navigate(['/messages']);
            return;
          }

          this.form.reset({
            subject: data.subject ?? '',
            detail: data.detail ?? data.message ?? '',
          });

          this.status = data.status ?? 'draft';

          this.existingAttachments = [...(data.userAttachments ?? [])];
          this.cdr.markForCheck();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load message detail.',
          });
          this.router.navigate(['/messages']);
        },
      });
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

  removeExistingAttachment(index: number): void {
    if (!this.messageId) return;

    const file = this.existingAttachments[index];
    if (!file) return;

    this.messageApi.deleteMessageAttachment(this.messageId, file.id).subscribe({
      next: () => {
        this.existingAttachments = this.existingAttachments.filter(
          (_, i) => i !== index,
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
  }

  submit(): void {
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
      this.isEditMode && this.messageId
        ? this.messageApi.putMessageThreadWithFiles(this.messageId, formData)
        : this.messageApi.postMessageThreadWithFiles(formData);

    request$
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
            summary: this.isEditMode ? 'Updated' : 'Created',
            detail: this.isEditMode
              ? 'Your message has been updated.'
              : 'Your message has been created.',
          });

          this.router.navigate(['/admin/messages']);
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: this.isEditMode ? 'Update failed' : 'Create failed',
            detail: this.isEditMode
              ? 'Unable to update your message.'
              : 'Unable to create your message.',
          });
        },
      });
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
}
