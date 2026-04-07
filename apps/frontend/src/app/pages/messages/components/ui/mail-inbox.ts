import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MailTableComponent } from './mail-table';
import { IMail } from './mail';
import { SubscriptionDestroyer } from '../../../../shared/core/helper/SubscriptionDestroyer.helper';
import { MessageThreadService } from '../../../../service/message-thread.service';

@Component({
  selector: 'app-mail-inbox',
  standalone: true,
  imports: [MailTableComponent],
  template: `<app-mail-table [mails]="mails"></app-mail-table>`,
})
export class MailInboxComponent
  extends SubscriptionDestroyer
  implements OnDestroy, OnInit
{
  mails: IMail[] = [];

  private router = inject(Router);
  private service = inject(MessageThreadService);

  constructor() {
    super();
    // this.subscription = this.mailService.mails$.subscribe((data) => {
    //   this.mails = data.filter(
    //     // eslint-disable-next-line no-prototype-builtins
    //     (d) => !d.hasOwnProperty('sent'),
    //   );
    // });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  override ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    // const obs = this.service.getMessageCriteria({}).subscribe((res) => {
    //   this.mails = Array.isArray(res?.data?.items) ? res.data.items : [];
    // });
    // this.AddSubscription(obs);
  }
}
