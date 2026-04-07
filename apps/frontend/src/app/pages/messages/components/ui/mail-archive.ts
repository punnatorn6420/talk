import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';
import { Mail } from './mail';

@Component({
  selector: 'app-mail-archive',
  standalone: true,
  imports: [MailTableComponent],
  template: `<app-mail-table [mails]="archivedMails"></app-mail-table>`,
})
export class MailArchiveComponent implements OnDestroy {
  archivedMails: Mail[] = [];

  subscription: Subscription;
  private mailService = inject(MailService);

  constructor() {
    this.subscription = this.mailService.mails$.subscribe((data) => {
      this.archivedMails = data.filter((d) => d.archived);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
