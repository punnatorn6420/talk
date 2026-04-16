import { CommonModule, Location, NgClass } from '@angular/common';
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { EditorModule } from 'primeng/editor';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { _MessageService } from '../../../service/message.service';
import { IMail } from '../../../types/message.model';
import { CardModule } from 'primeng/card';
import { DateTimePipe } from '../../../shared/core/pipes/date-time.pipe';

@Component({
  selector: 'app-message-admin-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    EditorModule,
    FileUploadModule,
    ProgressSpinnerModule,
    NgClass,
    CardModule,
    DateTimePipe,
  ],
  templateUrl: './message-admin-detail.component.html',
  styleUrl: './message-admin-detail.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageAdminDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly messageApi = inject(_MessageService);
  private readonly toast = inject(MessageService);
  private readonly location = inject(Location);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  replying = false;

  mail: IMail | null = null;
  replyText = '';
  pendingReplyFiles: File[] = [];

  private readonly maxFileSize = 10 * 1024 * 1024;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toast.add({
        severity: 'error',
        summary: 'Invalid request',
        detail: 'Message id is missing.',
      });
      return;
    }
    this.loadMail(id);
  }

  loadMail(id: string): void {
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
          this.mail = res.data || null;
          this.replyText = this.mail?.reply ?? '';

          if (!this.mail) {
            this.toast.add({
              severity: 'warn',
              summary: 'Not found',
              detail: `Message ${id} was not found.`,
            });
            this.cdr.markForCheck();
            return;
          }

          this.messageApi.putReadMessageThread(id).subscribe({
            error: () => {
              // ignore read error silently
            },
          });

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

  goBack(): void {
    this.location.back();
  }

  isReplied(): boolean {
    return !!this.mail?.reply?.trim();
  }

  onReplyFilesSelected(event: FileSelectEvent): void {
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

      const duplicated = this.pendingReplyFiles.some(
        (item) =>
          item.name === file.name &&
          item.size === file.size &&
          item.lastModified === file.lastModified,
      );

      if (!duplicated) {
        this.pendingReplyFiles = [...this.pendingReplyFiles, file];
      }
    }

    this.cdr.markForCheck();
  }

  removeReplyFile(index: number): void {
    this.pendingReplyFiles = this.pendingReplyFiles.filter(
      (_, i) => i !== index,
    );
    this.cdr.markForCheck();
  }

  private buildReplyFormData(): FormData {
    const formData = new FormData();
    formData.append('reply', this.replyText?.trim() || '');

    this.pendingReplyFiles.forEach((file) => {
      formData.append('files', file, file.name);
    });

    return formData;
  }

  sendReply(): void {
    if (!this.mail?.id) return;

    if (this.isReplied()) {
      this.toast.add({
        severity: 'warn',
        summary: 'Already replied',
        detail: 'This message has already been replied to.',
      });
      this.cdr.markForCheck();
      return;
    }

    const reply = this.replyText?.trim() || '';
    const plainReply = reply
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!plainReply && this.pendingReplyFiles.length === 0) {
      this.toast.add({
        severity: 'warn',
        summary: 'Reply required',
        detail: 'Please enter a reply message or attach at least one file.',
      });
      this.cdr.markForCheck();
      return;
    }

    this.replying = true;
    this.cdr.markForCheck();

    this.messageApi
      .putReplyMessageThread(String(this.mail.id), { reply })
      .pipe(
        finalize(() => {
          this.replying = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Reply sent',
            detail: 'Your reply has been saved successfully.',
          });

          this.mail = {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ...this.mail!,
            reply,
            repliedAt: new Date().toISOString(),
            status: 'Replied',
          };

          this.replyText = reply;
          this.pendingReplyFiles = [];
          this.cdr.markForCheck();

          // โหลด detail ใหม่เพื่อดึง attachment จริงจาก backend
          this.loadMail(String(this.mail.id));
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Send failed',
            detail: 'Unable to send reply.',
          });
          this.cdr.markForCheck();
        },
      });
  }

  getSenderName(): string {
    return this.mail?.fullName || 'Unknown Sender';
  }

  getSenderEmail(): string {
    return this.mail?.email || '-';
  }

  get bodyDisplayValue(): string {
    return (
      this.mail?.detail?.trim() || this.mail?.message?.trim() || '<p>-</p>'
    );
  }

  get replyDisplayValue(): string {
    return this.mail?.reply?.trim() || '<p>-</p>';
  }

  getOriginalAttachments(): unknown[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.mail as any)?.attachments ?? [];
  }

  getReplyAttachments(): unknown[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.mail as any)?.replyAttachments ?? [];
  }

  getAttachmentName(file: unknown): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (file as any)?.fileName || (file as any)?.name || 'Attachment';
  }

  getAttachmentUrl(file: unknown): string | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (file as any)?.url || (file as any)?.downloadUrl || null;
  }

  hasOriginalAttachments(): boolean {
    return this.getOriginalAttachments().length > 0;
  }

  hasReplyAttachments(): boolean {
    return this.getReplyAttachments().length > 0;
  }

  formatFileSize(size?: number | null): string {
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
