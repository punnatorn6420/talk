import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { IMail } from './mail';
import { MessageThreadService } from '../../../../service/message-thread.service';
import { switchMap } from 'rxjs';
import { SubscriptionDestroyer } from '../../../../shared/core/helper/SubscriptionDestroyer.helper';

@Component({
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    RippleModule,
    CommonModule,
    EditorModule,
    FormsModule,
  ],
  template: `@if (mail) {
    <div>
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pt-8 md:pt-0 gap-6 md:border-t-0 border-t border-surface-200 dark:border-surface-700"
      >
        <div class="flex items-center md:justify-start">
          <button
            pButton
            pRipple
            type="button"
            icon="pi pi-chevron-left"
            class="md:mr-4"
            text
            plain
            (click)="goBack()"
            aria-label="Go Back"
          ></button>
          <!-- @if (mail && mail.image) {
            <p-avatar
              [image]="'/demo/images/avatar/' + mail.image"
              size="large"
              shape="circle"
              class="border-2 border-surface-200 dark:border-surface-700"
            ></p-avatar>
          } -->
          <div class="flex flex-col mx-4">
            <span
              class="block text-surface-900 dark:text-surface-0 font-bold text-lg"
              >{{ mail.fullName || mail.modifiedBy || mail.createdBy }}</span
            >
            <span
              class="block text-surface-900 dark:text-surface-0 font-semibold"
              >To: {{ mail.email }}</span
            >
          </div>
        </div>
        <div class="flex items-center justify-end gap-x-4 px-6 md:px-0">
            <span
              class="text-surface-900 dark:text-surface-0 font-semibold whitespace-nowrap mr-auto"
              >{{ mail.createdAt | date: 'medium' }}</span
            >
          <button
            pButton
            pRipple
            type="button"
            icon="pi pi-reply"
            class="flex-shrink-0"
            text
            plain
            aria-label="Reply"
          ></button>
          <button
            pButton
            pRipple
            type="button"
            icon="pi pi-ellipsis-v"
            aria-label="More Options"
            class="flex-shrink-0"
            text
            plain
          ></button>
        </div>
      </div>
      <div
        class="border-surface-200 dark:border-surface-700 border rounded p-6"
      >
        <div
          class="text-surface-900 dark:text-surface-0 font-semibold text-lg mb-4"
        >
          {{ mail.subject }}
        </div>
        <p
          class="leading-normal mt-0 mb-4"
          [innerHTML]="mail.message || mail.detail"
        ></p>
        <p-editor
          [style]="{ height: '250px' }"
          [(ngModel)]="newMail.message"
        ></p-editor>
        <div class="flex gap-x-4 justify-end mt-4">
          <button
            pButton
            pRipple
            type="button"
            outlined
            icon="pi pi-image"
            aria-label="Attach Image"
          ></button>
          <button
            pButton
            pRipple
            type="button"
            outlined
            icon="pi pi-paperclip"
            aria-label="Attach File"
          ></button>
          <button
            pButton
            pRipple
            type="button"
            icon="pi pi-send"
            label="Send"
            (click)="sendMail()"
            aria-label="Send Mail"
          ></button>
        </div>
      </div>
    </div>
  } `,
})
export class MailDetailComponent
  extends SubscriptionDestroyer
  implements OnDestroy
{
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private messageThreadService = inject(MessageThreadService);

  newMail: IMail = {
    id: 0,
    subject: '',
    message: '',
    detail: '',
    reply: '',
    status: '',
    postedAt: '',
    repliedAt: null,
    createdAt: '',
    modifiedAt: '',
    createdBy: '',
    modifiedBy: '',
    email: '',
    jobTitle: '',
    department: '',
    fullName: '',
  };

  mail: IMail = {
    id: 0,
    subject: '',
    message: '',
    detail: '',
    reply: '',
    status: '',
    postedAt: '',
    repliedAt: null,
    createdAt: '',
    modifiedAt: '',
    createdBy: '',
    modifiedBy: '',
    email: '',
    jobTitle: '',
    department: '',
    fullName: '',
  };

  id = '';

  constructor() {
    super();
    this.AddSubscription(
      this.route.params
        .pipe(
          switchMap((params) => {
            this.id = params['id'];
            return this.messageThreadService.getMessageThreadById(this.id);
          }),
        )
        .subscribe((res) => {
          this.mail = res.data;
        }),
    );
  }

  goBack() {
    this.location.back();
  }

  sendMail() {
    if (this.newMail.message) {
      this.AddSubscription(
        this.messageThreadService
          .putReplyMessageThread(this.id, { reply: this.newMail.message })
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Reply sent',
            });
            this.router.navigate(['/admin/messages/inbox']);
          }),
      );
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
