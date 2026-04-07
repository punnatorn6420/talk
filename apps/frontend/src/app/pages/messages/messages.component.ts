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
import { MessageThreadService } from '../../service/message-thread.service';
import { SubscriptionDestroyer } from '../../shared/core/helper/SubscriptionDestroyer.helper';
import { IUserInfo, IUserRole } from '../../types/auth.model';
import {
  ICreateThreadPayload,
  IMessageThread,
  ThreadStatus,
} from '../../types/message-thread.model';

@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
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
export class MessagesComponent extends SubscriptionDestroyer implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly threadService = inject(MessageThreadService);

  readonly threadForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    content: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  currentUser!: IUserInfo;
  threads: IMessageThread[] = [];
  visibleThreads: IMessageThread[] = [];
  selectedThread: IMessageThread | null = null;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }
    this.currentUser = user;

    this.AddSubscription(
      this.threadService.getThreads().subscribe((threads) => {
        this.threads = threads;
        this.visibleThreads = this.isAdminView
          ? threads
          : threads.filter(
              (thread) => thread.senderId === this.currentUser.objectId,
            );
        this.selectedThread = this.visibleThreads[0] ?? null;
      }),
    );
  }

  get isAdminView(): boolean {
    return this.currentUser.roles.includes(IUserRole.Admin);
  }

  get fullName(): string {
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  createThread(): void {
    if (this.isAdminView || this.threadForm.invalid) {
      this.threadForm.markAllAsTouched();
      return;
    }

    const payload: ICreateThreadPayload = {
      ...this.threadForm.getRawValue(),
      senderId: this.currentUser.objectId,
      senderName: this.fullName,
      senderJobTitle: this.currentUser.jobTitle,
      senderDepartment: this.currentUser.department,
    };

    this.AddSubscription(
      this.threadService.createThread(payload).subscribe((newThread) => {
        this.selectedThread = newThread;
        this.threadForm.reset({ title: '', content: '' });
      }),
    );
  }

  selectThread(thread: IMessageThread): void {
    this.selectedThread = thread;
  }

  getStatusLabel(status: ThreadStatus): string {
    if (status === 'ANSWERED') return 'Answered';
    if (status === 'SEEN') return 'Seen';
    return 'New';
  }

  getTagSeverity(status: ThreadStatus): 'success' | 'info' | 'warn' {
    if (status === 'ANSWERED') return 'success';
    if (status === 'SEEN') return 'info';
    return 'warn';
  }
}
