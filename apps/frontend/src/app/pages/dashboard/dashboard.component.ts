import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../service/auth.service';
import { CeoMessageService } from '../../service/ceo-message.service';
import { SubscriptionDestroyer } from '../../shared/core/helper/SubscriptionDestroyer.helper';
import { IUserInfo, IUserRole } from '../../types/auth.model';
import { ICeoMessage, ICreateMessagePayload, MessageStatus } from '../../types/ceo-message.model';

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
  private readonly authService = inject(AuthService);

  readonly messageForm = this.fb.nonNullable.group({
    subject: ['', [Validators.required, Validators.maxLength(120)]],
    detail: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  currentUser: IUserInfo = this.createFallbackUser();
  messages: ICeoMessage[] = [];
  visibleMessages: ICeoMessage[] = [];
  selectedMessage: ICeoMessage | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser() ?? this.createFallbackUser();

    this.AddSubscription(
      this.ceoMessageService.getMessages().subscribe((messages: ICeoMessage[]) => {
        this.messages = messages;
        this.visibleMessages = this.isAdminView
          ? messages
          : messages.filter((message) => message.senderId === this.currentUser.userId);
        this.selectedMessage = this.visibleMessages[0] ?? null;
      }),
    );
  }

  get isAdminView(): boolean {
    return this.currentUser.roles.includes(IUserRole.Admin);
  }

  submitMessage(): void {
    if (this.isAdminView || this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      return;
    }

    const payload: ICreateMessagePayload = {
      ...this.messageForm.getRawValue(),
      senderId: this.currentUser.userId,
      senderName: this.fullName,
      senderJobTitle: this.currentUser.jobTitle,
      senderDepartment: this.currentUser.department,
    };

    this.AddSubscription(
      this.ceoMessageService.createMessage(payload).subscribe((newMessage: ICeoMessage) => {
        this.selectedMessage = newMessage;
        this.messageForm.reset({ subject: '', detail: '' });
      }),
    );
  }

  selectMessage(message: ICeoMessage): void {
    this.selectedMessage = message;
  }

  get fullName(): string {
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  getStatusCount(status: MessageStatus): number {
    return this.visibleMessages.filter((message) => message.status === status).length;
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

  private createFallbackUser(): IUserInfo {
    return {
      userId: '93834fe2-c75b-4276-a7d7-6a1d9ba2e29c',
      firstName: 'Punnatorn',
      lastName: 'Yimpong',
      email: 'Punnatorn.Yim@nokair.co.th',
      jobTitle: 'Front-End Development',
      department: 'HQ',
      active: true,
      team: '',
      roles: [IUserRole.User],
      createdAt: '2025-06-10T15:40:50',
      modifiedAt: '2025-06-10T15:40:50',
    };
  }
}
