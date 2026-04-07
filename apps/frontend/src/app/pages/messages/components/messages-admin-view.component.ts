import { Component, OnInit, inject } from '@angular/core';
import { MailInboxComponent } from './ui/mail-inbox';
import { MailSidebarComponent } from './ui/mail-sidebar';
import { Mail } from './ui/mail';
import { MailService } from './ui/service/mail.service';
import { MessageService } from 'primeng/api';
import { SubscriptionDestroyer } from '../../../shared/core/helper/SubscriptionDestroyer.helper';

const MOCK_MAILS: Mail[] = [
  {
    id: 1000,
    from: 'Ioni Bowcher',
    email: 'ionibowcher@gmail.com',
    image: 'ionibowcher.png',
    title: 'Apply These 7 Secret Techniques To Improve Event  Apply These',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    date: 'May 30 2022',
    important: true,
    starred: false,
    trash: false,
    spam: false,
    archived: false,
  },
  {
    id: 1001,
    from: 'Amy Elsner',
    email: 'amyelsner@gmail.com',
    image: 'amyelsner.png',
    title: 'Nullam purus metus, cras adipiscing magna et, aliquam gravida',
    message:
      'Iaculis nunc sed augue lacus viverra vitae. Amet porttitor eget dolor morbi non arcu.',
    date: 'May 30 2022',
    important: false,
    starred: false,
    trash: true,
    spam: false,
    archived: false,
  },
  {
    id: 1002,
    from: 'Asiya Javayant',
    email: 'asiyajavayant@gmail.com',
    image: 'asiyajavayant.png',
    title: 'Consectetur sed dis viverra lorem. Augue felis sed elit rhoncus non',
    message:
      'In tellus integer feugiat scelerisque varius. Auctor neque vitae tempus quam pellentesque nec nam aliquam.',
    date: 'May 28 2022',
    important: false,
    starred: false,
    trash: false,
    spam: true,
    archived: false,
  },
  {
    id: 1003,
    from: 'Xuxue Feng',
    email: 'xuexuefeng@gmail.com',
    image: 'xuxuefeng.png',
    title: 'Eget ipsum quam eu a, sit pellentesque molestie tristique.',
    message:
      'Euismod lacinia at quis risus. Quis commodo odio aenean sed adipiscing diam donec adipiscing tristique.',
    date: 'May 28 2022',
    important: false,
    starred: true,
    trash: false,
    spam: false,
    archived: false,
  },
  {
    id: 1004,
    from: 'Ivan Magalhaes',
    email: 'ionibowcher@gmail.com',
    image: 'ivanmagalhaes.png',
    title: 'Tincidunt sed vel, ipsum in tincidunt. Scelerisque lectus dolor cras',
    message:
      'Cursus mattis molestie a iaculis at erat. Nisi quis eleifend quam adipiscing vitae proin sagittis.',
    date: 'May 27 2022',
    important: false,
    starred: false,
    trash: true,
    spam: false,
    archived: false,
  },
];

@Component({
  selector: 'app-messages-admin-view',
  standalone: true,
  imports: [MailSidebarComponent, MailInboxComponent],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
  providers: [MessageService, MailService],
})
export class MessagesAdminViewComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  private readonly mailService = inject(MailService);

  ngOnInit(): void {
    this.mailService.updateMails(MOCK_MAILS);
  }
}
