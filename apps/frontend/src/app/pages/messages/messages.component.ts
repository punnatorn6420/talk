import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { IUserRole } from '../../types/auth.model';
import { MessagesAdminViewComponent } from './components/messages-admin-view.component';
import { MessagesUserViewComponent } from './components/messages-user-view.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MessagesAdminViewComponent, MessagesUserViewComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  private readonly authService = inject(AuthService);

  get isAdminView(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!currentUser && currentUser.roles.includes(IUserRole.Admin);
  }
}
