import { Component, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';
import { IMail } from './mail';

@Component({
  selector: 'app-mail-inbox',
  standalone: true,
  imports: [MailTableComponent],
  template: `<app-mail-table [mails]="mails"></app-mail-table>`,
})
export class MailInboxComponent implements OnDestroy {
  mails: IMail[] = [];

  subscription: Subscription;

  private mailService = inject(MailService);
  private router = inject(Router);

  constructor() {
    this.subscription = this.mailService.mails$.subscribe((data) => {
      this.mails = data.filter(
        // eslint-disable-next-line no-prototype-builtins
        (d) => !d.hasOwnProperty('sent'),
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
