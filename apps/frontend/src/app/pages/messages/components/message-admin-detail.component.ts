import { CommonModule, Location } from '@angular/common';
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
import { TextareaModule } from 'primeng/textarea';
import { _MessageService } from '../../../service/message.service';
import { IMail } from '../../../types/message.model';

@Component({
  selector: 'app-message-admin-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    TextareaModule,
    ProgressSpinnerModule,
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

  sendReply(): void {
    if (!this.mail?.id) return;

    const reply = this.replyText.trim();
    if (!reply) {
      this.toast.add({
        severity: 'warn',
        summary: 'Reply required',
        detail: 'Please enter a reply message.',
      });
      this.cdr.markForCheck();
      return;
    }

    this.replying = true;

    this.messageApi
      .putReplyMessageThread(String(this.mail.id), { reply })
      .pipe(finalize(() => (this.replying = false)))
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
            status: 'replied',
          };
          this.cdr.markForCheck();
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

  getPostedDate(value?: string | null): string {
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

  getSenderName(): string {
    return this.mail?.fullName || 'Unknown Sender';
  }

  getSenderEmail(): string {
    return this.mail?.email || '-';
  }

  getBody(): string {
    return this.mail?.detail?.trim() || this.mail?.message?.trim() || '-';
  }
}
