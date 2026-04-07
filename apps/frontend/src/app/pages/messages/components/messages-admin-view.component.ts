import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MailService } from './ui/service/mail.service';
import { MailAppComponent } from './ui';

@Component({
  selector: 'app-messages-admin-view',
  standalone: true,
  imports: [MailAppComponent],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
  providers: [MessageService, MailService],
})
export class MessagesAdminViewComponent {}
