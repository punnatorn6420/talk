import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { ICreateBroadcastRequest } from '../../../../types/broadcast.model';
import { PanelModule } from 'primeng/panel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { DatePickerModule } from 'primeng/datepicker';
import { Popover, PopoverModule } from 'primeng/popover';
import { SubscriptionDestroyer } from '../../../../shared/core/helper/SubscriptionDestroyer.helper';

@Component({
  selector: 'app-broadcast-admin-form-create',
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
    PanelModule,
    FileUploadModule,
    SelectButtonModule,
    PopoverModule,
    DatePickerModule,
  ],
  templateUrl: './broadcast-admin-form.component.html',
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BroadcastAdminFormCreateComponent extends SubscriptionDestroyer {
  private readonly broadcastApi = inject(_BroadcastService);
  private readonly toast = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  readonly pageTitle = 'Create Broadcast';
  readonly pageSubtitle = 'Create a new CEO broadcast draft';

  loadingDetail = false;
  saving = false;
  sending = false;

  pendingFiles: File[] = [];
  existingAttachments: { id: number; fileName: string }[] = [];

  form: ICreateBroadcastRequest & {
    createdAt?: string | null;
    createdBy?: string | null;
    readCount?: number;
    status?: string;
  } = {
    subject: '',
    detail: '',
    status: 'Draft',
    isPinned: false,
    startDisplayAt: '',
    expireDisplayAt: '',
  };

  constructor() {
    super();
    this.selectDurationPreset('7d');
  }

  get isEditMode(): boolean {
    return false;
  }

  get canSendCurrentBroadcast(): boolean {
    return false;
  }

  get canEditCurrentBroadcast(): boolean {
    return true;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeExistingAttachment(_: number): void {
    /* empty */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  downloadAttachment(_: { id: number; fileName: string }): void {
    /* empty */
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

  private buildPayload(status: 'Draft' | 'Sent'): ICreateBroadcastRequest {
    return {
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

    const obs = this.broadcastApi
      .createBroadcast(this.buildPayload('Draft'), this.pendingFiles)
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
            summary: 'Created',
            detail: 'Broadcast draft created successfully.',
          });
          this.router.navigate(['/admin/messages'], {
            queryParams: { menu: 'sent' },
          });
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Create failed',
            detail: 'Unable to create broadcast.',
          });
        },
      });
    this.AddSubscription(obs);
  }

  confirmSend(): void {
    /* empty */
  }

  customDisplayDateRange: Date[] | null = null;
  minCustomDisplayDate: Date = this.getToday();

  selectedDisplayDuration: '7d' | '1m' | 'forever' | 'custom' = '7d';

  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  get displayDurationLabel(): string {
    switch (this.selectedDisplayDuration) {
      case '7d':
        return this.formatDisplayRangeLabel(
          this.form.startDisplayAt,
          this.form.expireDisplayAt,
          'Display: 7 Days',
        );

      case '1m':
        return this.formatDisplayRangeLabel(
          this.form.startDisplayAt,
          this.form.expireDisplayAt,
          'Display: 1 Month',
        );

      case 'forever':
        return 'Display: Forever';

      case 'custom': {
        const start =
          this.customDisplayDateRange?.[0] ?? this.form.startDisplayAt;
        const end =
          this.customDisplayDateRange?.[1] ?? this.form.expireDisplayAt;

        const rangeLabel = this.formatDateRange(start, end);

        return rangeLabel
          ? `Display: ${rangeLabel}`
          : 'Select display date range';
      }

      default:
        return 'Select duration';
    }
  }

  private formatDisplayRangeLabel(
    start: Date | string | null | undefined,
    end: Date | string | null | undefined,
    fallback: string,
  ): string {
    const rangeLabel = this.formatDateRange(start, end);
    return rangeLabel ? `${fallback} (${rangeLabel})` : fallback;
  }

  private formatDateRange(
    start: Date | string | null | undefined,
    end: Date | string | null | undefined,
  ): string {
    const startLabel = this.formatDisplayDate(start);
    const endLabel = this.formatDisplayDate(end);

    if (!startLabel || !endLabel) return '';

    return `${startLabel} - ${endLabel}`;
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
    this.customDisplayDateRange = null;

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

  selectCustomDisplayDateRange(popover?: Popover): void {
    const startDate = this.customDisplayDateRange?.[0];
    const expireDate = this.customDisplayDateRange?.[1];

    if (!startDate || !expireDate) {
      return;
    }

    this.selectedDisplayDuration = 'custom';

    this.form.startDisplayAt = this.toApiDateTime(startDate);
    this.form.expireDisplayAt = this.toApiDateTime(expireDate);

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
