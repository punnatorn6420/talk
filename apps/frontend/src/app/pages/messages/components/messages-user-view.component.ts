import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../../service/auth.service';
import { MessageThreadService } from '../../../service/message-thread.service';
import { SubscriptionDestroyer } from '../../../shared/core/helper/SubscriptionDestroyer.helper';
import { IUserInfo } from '../../../types/auth.model';
import { ICreateThreadPayload, IMessageThread } from '../../../types/message-thread.model';

@Component({
  selector: 'app-messages-user-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, TextareaModule, TagModule],
  templateUrl: './messages-user-view.component.html',
})
export class MessagesUserViewComponent extends SubscriptionDestroyer implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly threadService = inject(MessageThreadService);

  currentUser!: IUserInfo;
  threads: IMessageThread[] = [];

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.currentUser = user;

    this.AddSubscription(
      this.threadService.getThreads().subscribe((threads) => {
        this.threads = threads.filter((thread) => thread.senderId === user.objectId);
      }),
    );
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ICreateThreadPayload = {
      ...this.form.getRawValue(),
      senderId: this.currentUser.objectId,
      senderName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      senderJobTitle: this.currentUser.jobTitle,
      senderDepartment: this.currentUser.department,
    };

    this.AddSubscription(
      this.threadService.createThread(payload).subscribe(() => {
        this.form.reset({ title: '', content: '' });
      }),
    );
  }

  getTagSeverity(status: IMessageThread['status']): 'success' | 'info' | 'warn' {
    if (status === 'ANSWERED') return 'success';
    if (status === 'SEEN') return 'info';
    return 'warn';
  }
}
