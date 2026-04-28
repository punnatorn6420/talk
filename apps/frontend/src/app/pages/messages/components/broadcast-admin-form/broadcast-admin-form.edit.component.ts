import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { _BroadcastService } from '../../../../service/broadcast.service';
import {
  IBroadcastAttachment,
  IUpdateBroadcastRequest,
} from '../../../../types/broadcast.model';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { Popover, PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-broadcast-admin-form-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    ButtonModule,
    InputTextModule,
    EditorModule,
    DialogModule,
    SkeletonModule,
    CardModule,
    FileUploadModule,
    SelectButtonModule,
    PopoverModule,
    DatePickerModule,
  ],
  templateUrl: './broadcast-admin-form.component.html',
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BroadcastAdminFormEditComponent implements OnInit {
  private readonly broadcastApi = inject(_BroadcastService);
  private readonly toast = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly confirmationService = inject(ConfirmationService);

  readonly pageTitle = 'Edit Broadcast';
  readonly pageSubtitle = 'Update CEO broadcast details';

  loadingDetail = false;
  saving = false;
  sending = false;

  broadcastId!: number;

  pendingFiles: File[] = [];
  existingAttachments: IBroadcastAttachment[] = [];

  form: IUpdateBroadcastRequest & {
    createdAt?: string | null;
    createdBy?: string | null;
    readCount?: number;
    status?: string;
  } = {
    id: undefined,
    subject: '',
    detail: '',
    status: 'Draft',
    isPinned: false,
    startDisplayAt: '',
    expireDisplayAt: '',
    createdAt: '',
    createdBy: '',
    readCount: 0,
  };

  ngOnInit(): void {
    this.broadcastId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBroadcastDetail();
  }

  get isEditMode(): boolean {
    return true;
  }

  get canSendCurrentBroadcast(): boolean {
    return (this.form.status || '').toLowerCase() !== 'sent';
  }

  get canEditCurrentBroadcast(): boolean {
    return (this.form.status || '').toLowerCase() !== 'sent';
  }

  goBack(): void {
    this.location.back();
  }

  onFilesSelected(event: FileSelectEvent): void {
    const files = event.files ?? [];
    this.pendingFiles = [...this.pendingFiles, ...files];
    this.cdr.markForCheck();
  }

  removePendingFile(index: number): void {
    this.pendingFiles = this.pendingFiles.filter((_, i) => i !== index);
    this.cdr.markForCheck();
  }

  removeExistingAttachment(index: number): void {
    const file = this.existingAttachments[index];
    if (!file) return;

    this.broadcastApi
      .deleteBroadcastAttachment(this.broadcastId, file.id)
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

  downloadAttachment(file: IBroadcastAttachment): void {
    this.broadcastApi
      .downloadBroadcastAttachment(this.broadcastId, file.id)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = file.fileName || 'attachment';
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

  getStatusClass(status?: string | null): string {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'sent':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  private normalizeDateForInput(value?: string | null): string {
    if (!value || value === '0001-01-01T00:00:00Z') return '';
    if (!value || value === '0001-01-01T00:00:00') return '';
    return value.slice(0, 16);
  }

  private loadBroadcastDetail(): void {
    this.loadingDetail = true;

    this.broadcastApi
      .getBroadcastById(this.broadcastId)
      .pipe(
        finalize(() => {
          this.loadingDetail = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
          const item = res.data;
          if (!item) return;

          this.form = {
            id: item.id,
            subject: item.subject || '',
            detail: item.detail || '',
            status: item.status || 'Draft',
            isPinned: item.isPinned ?? false,
            startDisplayAt: this.normalizeDateForInput(item.startDisplayDate),
            expireDisplayAt: this.normalizeDateForInput(item.expireDisplayDate),
            createdAt: item.createdAt || '',
            createdBy: item.createdBy || '',
            readCount: item.readCount ?? 0,
          };

          this.selectedDisplayDuration = this.getDurationPresetFromDates(
            this.form.startDisplayAt,
            this.form.expireDisplayAt,
          );

          this.customExpireDate =
            this.selectedDisplayDuration === 'custom' &&
            this.form.expireDisplayAt
              ? new Date(this.form.expireDisplayAt)
              : null;

          this.existingAttachments = [...(item.attachments ?? [])];
          this.pendingFiles = [];
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Unable to load broadcast detail.',
          });
        },
      });
  }

  private getDurationPresetFromDates(
    start?: string | null,
    expire?: string | null,
  ): '7d' | '1m' | 'forever' | 'custom' {
    if (!start || !expire) return '7d';

    const startDate = new Date(start);
    const expireDate = new Date(expire);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(expireDate.getTime())
    ) {
      return '7d';
    }

    const diffDays = Math.round(
      (expireDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays >= 365000) return 'forever';
    if (diffDays >= 28 && diffDays <= 32) return '1m';
    if (diffDays >= 6 && diffDays <= 8) return '7d';

    return 'custom';
  }

  private buildPayload(status: 'Draft' | 'Sent'): IUpdateBroadcastRequest {
    return {
      id: this.broadcastId,
      subject: this.form.subject?.trim() || '',
      detail: this.form.detail?.trim() || '',
      status,
      isPinned: this.form.isPinned ?? false,
      startDisplayAt: this.form.startDisplayAt || '',
      expireDisplayAt: this.form.expireDisplayAt || '',
    };
  }

  submitForm(): void {
    if (!this.form.subject?.trim()) {
      this.toast.add({
        severity: 'warn',
        summary: 'Subject required',
        detail: 'Please enter a broadcast subject.',
      });
      return;
    }

    if (!this.form.detail?.trim()) {
      this.toast.add({
        severity: 'warn',
        summary: 'Message required',
        detail: 'Please enter a broadcast message.',
      });
      return;
    }

    this.saving = true;

    this.broadcastApi
      .updateBroadcast(
        this.broadcastId,
        this.buildPayload('Draft'),
        this.pendingFiles,
      )
      .pipe(
        finalize(() => {
          this.saving = false;
          this.cdr.markForCheck();
          this.goBack();
        }),
      )
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Broadcast updated successfully.',
          });
          this.loadBroadcastDetail();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Update failed',
            detail: 'Unable to update broadcast.',
          });
        },
      });
  }

  confirmSend(): void {
    if (!this.canSendCurrentBroadcast) return;

    this.confirmationService.confirm({
      header: 'Send broadcast',
      message: 'Are you sure you want to send this broadcast?',
      icon: 'pi pi-send',
      acceptLabel: 'Send',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.sending = true;

        this.broadcastApi
          .updateBroadcast(
            this.broadcastId,
            this.buildPayload('Sent'),
            this.pendingFiles,
          )
          .pipe(
            finalize(() => {
              this.sending = false;
              this.cdr.markForCheck();
            }),
          )
          .subscribe({
            next: () => {
              this.toast.add({
                severity: 'success',
                summary: 'Sent',
                detail: 'Broadcast sent successfully.',
              });
              this.loadBroadcastDetail();
            },
            error: () => {
              this.toast.add({
                severity: 'error',
                summary: 'Send failed',
                detail: 'Unable to send broadcast.',
              });
            },
          });
      },
    });
  }

  customExpireDate: Date | null = null;
  minCustomExpireDate: Date = this.getTomorrow();

  selectedDisplayDuration: '7d' | '1m' | 'forever' | 'custom' = '7d';

  private getTomorrow(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  get displayDurationLabel(): string {
    switch (this.selectedDisplayDuration) {
      case '7d':
        return 'Display: 7 Days';
      case '1m':
        return 'Display: 1 Month';
      case 'forever':
        return 'Display: Forever';
      case 'custom': {
        const displayDate =
          this.formatDisplayDate(this.customExpireDate) ||
          this.formatDisplayDate(this.form.expireDisplayAt);
        return displayDate ? `Expire: ${displayDate}` : 'Select expire date';
      }
      default:
        return 'Select duration';
    }
  }

  private formatDisplayDate(date: Date | string | null | undefined): string {
    if (!date) return '';

    const value = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(value.getTime())) return '';

    return value.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  selectDurationPreset(
    value: '7d' | '1m' | 'forever',
    popover?: Popover,
  ): void {
    this.selectedDisplayDuration = value;
    this.customExpireDate = null;

    const now = new Date();
    const expire = new Date(now);

    if (value === '7d') {
      expire.setDate(expire.getDate() + 7);
    }

    if (value === '1m') {
      expire.setMonth(expire.getMonth() + 1);
    }

    if (value === 'forever') {
      expire.setFullYear(expire.getFullYear() + 1000);
    }

    this.form.startDisplayAt = this.toApiDateTime(now);
    this.form.expireDisplayAt = this.toApiDateTime(expire);

    popover?.hide();
    this.cdr.markForCheck();
  }

  selectCustomExpireDate(popover?: Popover): void {
    if (!this.customExpireDate) return;

    const now = new Date();

    this.selectedDisplayDuration = 'custom';
    this.form.startDisplayAt = this.toApiDateTime(now);
    this.form.expireDisplayAt = this.toApiDateTime(this.customExpireDate);

    popover?.hide();
    this.cdr.markForCheck();
  }

  private toApiDateTime(date: Date): string {
    const pad = (value: number): string => value.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }
}
