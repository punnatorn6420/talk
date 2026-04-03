import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { SubscriptionDestroyer } from '../../shared/core/helper/SubscriptionDestroyer.helper';
import { CeoMessageService } from '../../service/ceo-message.service';
import { ICeoMessage, MessageStatus } from '../../types/ceo-message.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    InputTextModule,
    TextareaModule,
    TagModule,
  ],
})
export class DashboardComponent extends SubscriptionDestroyer implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ceoMessageService = inject(CeoMessageService);

  readonly messageForm = this.fb.nonNullable.group({
    senderName: ['', [Validators.required]],
    subject: ['', [Validators.required, Validators.maxLength(120)]],
    detail: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  messages: ICeoMessage[] = [];
  selectedMessage: ICeoMessage | null = null;

  ngOnInit(): void {
    this.AddSubscription(
      this.ceoMessageService.getMessages().subscribe((messages: ICeoMessage[]) => {
        this.messages = messages;
        this.selectedMessage = messages[0] ?? null;
      }),
    );
  }

  submitMessage(): void {
    if (this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      return;
    }

    this.AddSubscription(
      this.ceoMessageService
        .createMessage(this.messageForm.getRawValue())
        .subscribe((newMessage: ICeoMessage) => {
          this.selectedMessage = newMessage;
          this.messageForm.reset({ senderName: '', subject: '', detail: '' });
        }),
    );
  }

  selectMessage(message: ICeoMessage): void {
    this.selectedMessage = message;
  }

  getStatusCount(status: MessageStatus): number {
    return this.messages.filter((message) => message.status === status).length;
  }

  getTagSeverity(status: MessageStatus): 'success' | 'warn' | 'info' {
    if (status === 'REPLIED') {
      return 'success';
    }
    if (status === 'READ') {
      return 'info';
    }
    return 'warn';
  }
}
