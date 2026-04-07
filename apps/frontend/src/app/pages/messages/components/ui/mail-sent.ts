import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';
import { Mail } from './mail';

@Component({
  standalone: true,
  imports: [MailTableComponent],
  template: `<app-mail-table [mails]="sentMails"></app-mail-table>`,
})
export class MailSentComponent {
  sentMails: Mail[] = [];

  subscription: Subscription;
  private mailService = inject(MailService);

  constructor() {
    this.subscription = this.mailService.mails$.subscribe((data) => {
      this.sentMails = data.filter((d) => d.sent && !d.trash && !d.archived);
    });
  }
}
