import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { MailAppComponent } from './ui';

@Component({
  selector: 'app-messages-admin-view',
  standalone: true,
  imports: [FormsModule, MailAppComponent],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
  providers: [MessageService],
})
export class MessagesAdminViewComponent {}
