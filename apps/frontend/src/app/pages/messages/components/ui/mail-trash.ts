import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';
import { Mail } from './mail';

@Component({
  template: `<app-mail-table [mails]="trashMails"></app-mail-table>`,
  standalone: true,
  imports: [MailTableComponent],
})
export class MailTrashComponent implements OnDestroy {
  trashMails: Mail[] = [];

  subscription: Subscription;
  private mailService = inject(MailService);

  constructor() {
    this.subscription = this.mailService.mails$.subscribe((data) => {
      this.trashMails = data.filter((d) => d.trash);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
