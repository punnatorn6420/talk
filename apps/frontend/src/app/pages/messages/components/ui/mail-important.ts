import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';
import { Mail } from './mail';

@Component({
  selector: 'app-mail-important',
  standalone: true,
  imports: [MailTableComponent],
  template: `<app-mail-table [mails]="importantMails"></app-mail-table>`,
})
export class MailImportantComponent implements OnDestroy {
  importantMails: Mail[] = [];

  subscription: Subscription;

  private mailService = inject(MailService);

  constructor() {
    this.subscription = this.mailService.mails$.subscribe((data) => {
      this.importantMails = data.filter(
        (d) => d.important && !d.spam && !d.trash && !d.archived,
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
