import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';
import { Mail } from './mail';

@Component({
  selector: 'app-mail-spam',
  standalone: true,
  imports: [MailTableComponent],
  template: `<app-mail-table [mails]="spamMails"></app-mail-table> `,
})
export class MailSpamComponent implements OnDestroy {
  spamMails!: Mail[];

  subscription: Subscription;
  private mailService = inject(MailService);

  constructor() {
    this.subscription = this.mailService.mails$.subscribe((data) => {
      this.spamMails = data.filter(
        (d) =>
          d.spam &&
          !d.archived &&
          !d.trash &&
          !Object.prototype.hasOwnProperty.call(d, 'sent'),
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
