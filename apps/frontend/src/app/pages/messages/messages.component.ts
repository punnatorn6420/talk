import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { IUserRole } from '../../types/auth.model';
import { MessagesAdminViewComponent } from './components/messages-admin-view.component';
import { MessagesUserViewComponent } from './components/messages-user-view.component';
import { MessageThreadService } from '../../service/message-thread.service';
import { SubscriptionDestroyer } from '../../shared/core/helper/SubscriptionDestroyer.helper';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MessagesAdminViewComponent, MessagesUserViewComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent extends SubscriptionDestroyer implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly service = inject(MessageThreadService);

  ngOnInit(): void {
    const obs = this.service.getMessageCriteria({}).subscribe({
      next: (response) => {
        console.log('Message criteria response:', response);
      },
      error: (error) => {
        console.error('Error fetching message criteria:', error);
      },
    });
    this.AddSubscription(obs);
  }

  get isAdminView(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!currentUser && currentUser.roles.includes(IUserRole.Admin);
  }
}
