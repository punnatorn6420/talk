import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { MailService } from './service/mail.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { IMail } from './mail';

@Component({
  selector: 'app-mail-table',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    RippleModule,
    AvatarModule,
    MenuModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule,
  ],
  template: `<p-table
    #dt
    [value]="mails"
    responsiveLayout="scroll"
    [rows]="10"
    [globalFilterFields]="['from', 'title', 'message']"
    [paginator]="true"
    [rowsPerPageOptions]="[10, 20, 30]"
    [(selection)]="selectedMails"
    selectionMode="multiple"
    [rowHover]="true"
    dataKey="id"
  >
    <ng-template #caption>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex gap-2 items-center">
          <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
          <button
            aria-label="Refresh"
            pButton
            pRipple
            type="button"
            icon="pi pi-refresh"
            rounded
            text
            plain
            class="ml-4"
          ></button>
        </div>
        <p-iconfield>
          <p-inputicon class="pi pi-search" />
          <input
            pInputText
            type="text"
            (input)="onGlobalFilter(dt, $event)"
            placeholder="Search Mail"
            class="w-full sm:w-auto"
          />
        </p-iconfield>
      </div>
    </ng-template>
    <ng-template #body let-mail>
      <tr
        (mouseenter)="toggleOptions($event, options, date)"
        (mouseleave)="toggleOptions($event, options, date)"
        (click)="onRowSelect(mail.id)"
        class="cursor-pointer"
      >
        <td style="width: 4rem" class="pl-3">
          <p-tableCheckbox
            [value]="mail"
            (click)="$event.stopPropagation()"
            (touchend)="$event.stopPropagation()"
          ></p-tableCheckbox>
        </td>
        <td style="min-width: 4rem">
          <p-avatar
            [image]="
              mail.image
                ? '/demo/images/avatar/' + mail.image
                : 'assets/layout/images/avatar.png'
            "
          ></p-avatar>
        </td>
        <td style="min-width: 12rem" class="text-900 font-semibold">
          {{ mail.from || mail.to }}
        </td>
        <td style="min-width: 12rem">
          <span
            class="font-medium white-space-nowrap overflow-hidden text-overflow-ellipsis block"
            style="max-width: 30rem"
          >
            {{ mail.title }}
          </span>
        </td>
        <td style="width: 12rem;">
          <div class="flex justify-content-end w-full px-0">
            <span #date class="text-700 font-semibold white-space-nowrap">
              {{ mail.date }}
            </span>
            <div style="display: none" #options>
              <button
                pButton
                pRipple
                icon="pi pi-reply"
                class="h-8 w-8 mr-2"
                severity="secondary"
                (click)="onReply($event, mail)"
                pTooltip="Reply"
                tooltipPosition="top"
                type="button"
              ></button>
              <button
                pButton
                pRipple
                icon="pi pi-trash"
                class="h-8 w-8"
                severity="danger"
                (click)="onTrash($event, mail)"
                pTooltip="Trash"
                tooltipPosition="top"
                type="button"
              ></button>
            </div>
          </div>
        </td>
      </tr>
    </ng-template>
  </p-table> `,
})
export class MailTableComponent implements OnInit {
  @Input() mails!: IMail[];

  menuItems: MenuItem[] = [];

  selectedMails: IMail[] = [];

  mail: IMail = {
    id: 0,
    subject: '',
    message: '',
    reply: '',
    status: '',
    postedAt: '',
    repliedAt: '',
    createdAt: '',
    modifiedAt: '',
    createdBy: '',
    modifiedBy: '',
    email: '',
  };

  dialogVisible = false;

  private router = inject(Router);
  private mailService = inject(MailService);
  private messageService = inject(MessageService);

  constructor() {
    /* empty */
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    /* empty */
  }

  toggleOptions(event: Event, opt: HTMLElement, date: HTMLElement) {
    if (event.type === 'mouseenter') {
      opt.style.display = 'flex';
      date.style.display = 'none';
    } else {
      opt.style.display = 'none';
      date.style.display = 'flex';
    }
  }

  onRowSelect(id: number) {
    this.router.navigate(['/admin/messages/detail/', id]);
  }

  onDelete(id: number) {
    this.mailService.onDelete(id);
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Mail deleted',
      life: 3000,
    });
  }

  // onDeleteMultiple() {
  //   if (this.selectedMails && this.selectedMails.length > 0) {
  //     this.mailService.onDeleteMultiple(this.selectedMails);
  //     this.messageService.add({
  //       severity: 'info',
  //       summary: 'Info',
  //       detail: 'Mails deleted',
  //       life: 3000,
  //     });
  //   }
  // }

  onTrash(event: Event, mail: IMail) {
    event.stopPropagation();
    this.mailService.onTrash(mail.id);
  }

  onReply(event: Event, mail: IMail) {
    event.stopPropagation();
    this.mail = mail;
    this.dialogVisible = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
