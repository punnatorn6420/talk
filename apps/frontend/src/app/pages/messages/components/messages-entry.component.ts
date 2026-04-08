import { Component, computed, inject } from '@angular/core';
import { MessagesAdminViewComponent } from './messages-admin-view.component';
import { MessagesUserViewComponent } from './messages-user-view.component';
import { AuthService } from '../../../service/auth.service';
import { IUserRole } from '../../../types/auth.model';

@Component({
  selector: 'app-messages-entry',
  standalone: true,
  imports: [MessagesAdminViewComponent, MessagesUserViewComponent],
  templateUrl: './messages-entry.component.html',
})
export class MessagesEntryComponent {
  private readonly authService = inject(AuthService);

  isAdminView = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    return (
      !!currentUser &&
      (currentUser.roles.includes(IUserRole.Admin) ||
        currentUser.roles.includes(IUserRole.CEO))
    );
  });
}
