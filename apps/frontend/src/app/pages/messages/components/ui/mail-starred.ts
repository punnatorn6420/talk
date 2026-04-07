import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';
import { Mail } from './mail';

@Component({
  selector: 'app-mail-starred',
  standalone: true,
  imports: [MailTableComponent],
  template: `<app-mail-table [mails]="starredMails"></app-mail-table>`,
})
export class MailStarredComponent implements OnDestroy {
  private mailService = inject(MailService);

  starredMails: Mail[] = [];

  subscription: Subscription;

  constructor() {
    this.subscription = this.mailService.mails$.subscribe((data) => {
      this.starredMails = data.filter(
        (d) => d.starred && !d.archived && !d.trash,
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
