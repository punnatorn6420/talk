import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MailService } from './service/mail.service';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Mail } from './mail';

@Component({
  selector: 'app-mail-reply',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    EditorModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    RippleModule,
  ],
  template: `@if (content) {
    <div class="p-0 m-0">
      <div
        class="bg-surface-0 dark:bg-surface-950 grid grid-cols-12 grid-nogutter flex-col md:flex-row gap-12 p-8 rounded"
      >
        <div class="col-span-6">
          <label
            for="to"
            class="block text-surface-900 dark:text-surface-0 font-semibold mb-4"
            >To</label
          >
          <p-iconfield class="w-full" style="height: 3.5rem">
            <p-inputicon class="pi pi-user" style="left: 1.5rem" />
            <input
              id="to"
              type="text"
              pInputText
              class="w-full !pl-16 text-surface-900 dark:text-surface-0 font-semibold"
              style="height: 3.5rem"
              [(ngModel)]="content.from"
            />
          </p-iconfield>
        </div>
        <div class="col-span-6">
          <label
            for="Subject"
            class="block text-surface-900 dark:text-surface-0 font-semibold mb-4"
            >Subject</label
          >
          <p-iconfield class="w-full" style="height: 3.5rem">
            <p-inputicon class="pi pi-pencil" style="left: 1.5rem" />
            <input
              id="subject"
              type="text"
              pInputText
              placeholder="Subject"
              class="w-full !pl-16 text-surface-900 dark:text-surface-0 font-semibold"
              style="height: 3.5rem"
              [(ngModel)]="content.title"
            />
          </p-iconfield>
        </div>
        @if (displayMessage) {
          <div class="col-span-12" [innerHTML]="content.message"></div>
        }
        <div class="col-span-12">
          <button
            type="button"
            class="bg-surface-50 dark:bg-surface-950 cursor-pointer rounded px-2 border-0"
            (click)="toggleMessage()"
            (keydown.enter)="toggleMessage()"
            (keydown.space)="toggleMessage()"
            [pTooltip]="displayMessage ? 'Hide content' : 'Show content'"
            aria-label="Toggle message content"
          >
            <i class="pi pi-ellipsis-h"></i>
          </button>
          <p-editor
            [style]="{ height: '250px' }"
            class="mt-4"
            [(ngModel)]="newMail.message"
          ></p-editor>
        </div>
      </div>
      <div
        class="flex gap-x-4 justify-end p-8 border-t border-surface-200 dark:border-surface-700"
      >
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
          class="h-12"
          icon="pi pi-send"
          label="Send"
          outlined
          icon="pi pi-paperclip"
          aria-label="Attach File"
        ></button>
        <button
          pButton
          pRipple
          type="button"
          class="h-12"
          icon="pi pi-send"
          label="Send"
          (click)="sendMail()"
          aria-label="Send Mail"
        ></button>
      </div>
    </div>
  }`,
})
export class MailReplyComponent {
  newMail: Mail = {
    id: '',
    to: '',
    email: '',
    image: '',
    title: '',
    message: '',
    date: '',
    important: false,
    starred: false,
    trash: false,
    spam: false,
    archived: false,
    sent: true,
  };

  displayMessage = false;

  @Input() content: Mail = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() hide: EventEmitter<any> = new EventEmitter();

  private messageService = inject(MessageService);
  private mailService = inject(MailService);

  sendMail() {
    const { image, from, title } = this.content;
    this.newMail = {
      ...this.newMail,
      to: from,
      title: title,
      image: image,
    };
    this.mailService.onSend(this.newMail);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Mail sent',
    });
    this.hide.emit();
  }

  toggleMessage() {
    this.displayMessage = !this.displayMessage;
  }
}
