import { Component } from '@angular/core';
import { MailAppComponent } from './ui';

@Component({
  selector: 'app-messages-admin-view',
  standalone: true,
  imports: [MailAppComponent],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
})
export class MessagesAdminViewComponent {}
