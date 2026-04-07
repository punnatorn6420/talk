import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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

  private service = inject(MessageThreadService);

  constructor() {
    super();
    this.AddSubscription(
      this.service.mails$.subscribe((data) => {
        this.mails = data;
      }),
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngOnInit() {
    this.AddSubscription(
      this.service.getMessageCriteria({}).subscribe((res) => {
        this.service.updateMails(res.data.items || []);
      }),
    );
  }
}
